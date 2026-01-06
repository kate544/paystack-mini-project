import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack'; 
import './PaystackPayment.css';

const generateReference = () => {
    return "CH-" + (new Date()).getTime().toString() + Math.floor(Math.random() * 1000);
};

const PaystackPayment = ({ amount, email }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [localAmount, setLocalAmount] = useState(amount || 0);

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [cardType, setCardType] = useState('mastercard');

    const config = {
        reference: generateReference(),
        email: email || "kathryntokoli@gmail.com",
        amount: localAmount * 100, 
        publicKey: 'pk_test_e513d958c35b5283877618197014c8b5cd4681ae', 
        currency: 'KES',
    };

    const initializePayment = usePaystackPayment(config);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let val = value;

        if (name === 'name') val = value.toUpperCase();
        if (name === 'number') {
            val = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19);
            setCardType(val.startsWith('4') ? 'visa' : 'mastercard');
        }
        setFormData({ ...formData, [name]: val });
    };

    const onSuccess = (reference) => {
        setReceiptData(reference);
        setIsSuccess(true);
    };

    const onClose = () => {
        alert("Payment cancelled. Your room at ComfortHomes is still waiting!");
    };

    const handlePayment = () => {
        if (!formData.name.trim()) {
            alert("Please enter the Cardholder Name.");
            return;
        }
        if (localAmount <= 0) {
            alert("Please enter a valid amount to pay.");
            return;
        }
        initializePayment(onSuccess, onClose);
    };

    const logos = {
        mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
        visa: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
    };

    if (isSuccess) {
        return (
            <div className="payment-container">
                <div className="success-box">
                    <div className="check-icon">✓</div>
                    <h2>Booking Confirmed!</h2>
                    <p>Thank you, <strong>{formData.name || "Guest"}</strong>. Your payment was successful.</p>
                    
                    <div className="receipt-details">
                        <div className="receipt-row">
                            <span>Amount:</span>
                            <strong>KES {localAmount.toLocaleString()}</strong>
                        </div>
                        <div className="receipt-row">
                            <span>Reference:</span>
                            <span className="ref-text">{receiptData?.reference}</span>
                        </div>
                    </div>

                    <button className="pay-btn" onClick={() => window.location.reload()}>
                        Book Another Room
                    </button>
                    <p className="secure-text" style={{marginTop: '20px'}}>A receipt has been sent to {email}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="visa-card">
                <div className="chip"></div>
                <div className="card-number-display">{formData.number || "•••• •••• •••• ••••"}</div>
                <div className="card-bottom-row">
                    <div className="info-group">
                        <span>CARD HOLDER</span>
                        <p>{formData.name || "USERNAME"}</p>
                    </div>
                    <div className="info-group">
                        <span>EXPIRES</span>
                        <p>{formData.expiry || "MM/YY"}</p>
                    </div>
                </div>
            </div>

            <div className="form-box">
                <div className="order-summary">
                    <span>Total Amount:</span>
                    <strong>KES {localAmount.toLocaleString()}</strong>
                </div>

                <div className="field">
                    <label>Enter Amount to Pay (KES)</label>
                    <input 
                        type="number" 
                        placeholder="e.g. 10000" 
                        onChange={(e) => setLocalAmount(parseFloat(e.target.value) || 0)} 
                    />
                </div>

                <div className="field">
                    <label>Cardholder Name</label>
                    <input name="name" type="text" placeholder="Full Name" onChange={handleInputChange} />
                </div>
                
                <div className="field">
                    <label>Card Number</label>
                    <div className="input-with-logo">
                        <input name="number" type="text" placeholder="4242 4242 4242 4242" value={formData.number} onChange={handleInputChange} />
                        <img src={logos[cardType]} alt="card type" className={`brand-logo ${cardType}`} />
                    </div>
                </div>

                <div className="row-split">
                    <div className="field">
                        <label>Expiry Date</label>
                        <input name="expiry" type="text" placeholder="MM/YY" maxLength="5" onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label>CVV</label>
                        <input name="cvv" type="password" placeholder="***" maxLength="3" onChange={handleInputChange} />
                    </div>
                </div>

                <button className="pay-btn" onClick={handlePayment}>
                    Confirm & Pay KES 
                </button>
                <p className="secure-text">🔒 Secured by Paystack (Card & M-Pesa)</p>
            </div>
        </div>
    );
};

export default PaystackPayment;