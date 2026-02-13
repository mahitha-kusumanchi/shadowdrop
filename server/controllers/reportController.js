const Report = require('../models/Report');
const { getPrivateKey } = require('../config/keys');
const crypto = require('crypto');

exports.createReport = async (req, res) => {
    try {
        const { encryptedData, encryptedKey, iv, reportId } = req.body;
        if (!encryptedData || !encryptedKey || !iv) {
            return res.status(400).json({ message: 'Missing encrypted data fields' });
        }
        const report = await Report.create({
            reportId: reportId,
            encryptedData,
            encryptedKey,
            iv,
            status: 'pending'
        });
        res.status(201).json({ message: 'Report submitted successfully', reportId: report.reportId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const reportToSign = await Report.findByPk(id);
        if (!reportToSign) return res.status(404).json({ message: 'Report not found' });

        const dataToSign = `${reportToSign.reportId}:${status}`;
        const signer = crypto.createSign('SHA256');
        signer.update(dataToSign);
        const signature = signer.sign(getPrivateKey(), 'base64');

        await reportToSign.update({
            status,
            signature,
            signedBy: req.user.username,
            signedAt: new Date()
        });
        res.json(reportToSign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        await report.destroy();
        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
