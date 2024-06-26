import React from 'react';
import QRCode from 'qrcode.react';
import './QrCode.css'; // Import CSS file

const QRCodeGenerator = ({ text }) => {
  return (
    <div className="qr-code-container">
      <QRCode value={text} />
    </div>
  );
};

export default QRCodeGenerator;
