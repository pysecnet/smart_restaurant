import React from 'react';
import { motion } from 'framer-motion';
import { QrCodeIcon, DevicePhoneMobileIcon, ClockIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

const ScanOrder: React.FC = () => {
  const steps = [
    { icon: QrCodeIcon, title: 'Scan QR Code', description: "Use your phone's camera to scan the QR code placed at your table", number: '1' },
    { icon: DevicePhoneMobileIcon, title: 'Browse Menu', description: 'View our digital menu with photos, descriptions, and prices', number: '2' },
    { icon: ShoppingCartIcon, title: 'Place Order', description: 'Add items to your cart and place your order directly from your phone', number: '3' },
    { icon: ClockIcon, title: 'Track & Enjoy', description: 'Get real-time updates on your order status while you relax', number: '4' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">📱</div>
            <h1 className="text-4xl font-bold text-white mb-3">Scan & Order</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Skip the wait — scan the QR code at your table and order directly from your phone</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* QR Code Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 inline-block">
              <QRCodeSVG
                value={`${window.location.origin}/guest-order?table=demo`}
                size={240}
                level="H"
                includeMargin={false}
                className="rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Try scanning this demo QR code with your camera
            </p>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-amber-700">
                💡 Each table has its own unique QR code. Scan the one at your table for automatic table assignment.
              </p>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#1a2233] mb-1">How It Works</h2>
              <p className="text-sm text-gray-500">Four simple steps to a seamless dining experience</p>
            </div>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md hover:border-gray-200 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a2233] to-[#2d3748] flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Step {step.number}</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#1a2233] mb-0.5">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Help card */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#e6c200] rounded-2xl p-6">
              <h3 className="font-semibold text-[#1a2233] mb-1">Need Help?</h3>
              <p className="text-sm text-[#1a2233]/70">If you're having trouble scanning the QR code, our staff will be happy to assist you.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScanOrder;
