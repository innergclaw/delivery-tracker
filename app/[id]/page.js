"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, ArrowRight, Home, HelpCircle, CheckCircle } from 'lucide-react';

const trackingSteps = [
  { key: 'received', label: 'Order Received', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: CookingPot },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'arriving_soon', label: 'Arriving Soon', icon: ArrowRight },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getStepIndex = (status) => {
  const idx = trackingSteps.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
};

export default function TrackerPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?search=${params.id}`);
        const data = await res.json();
        if (data && data.id) {
          setOrder(data);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <Circle className="w-16 h-16 mx-auto stroke-gray-500" />
        <h1 className="text-2xl font-bold mb-2 text-center">Order Not Found</h1>
        <p className="text-gray-500 mb-6 text-center">We couldn't find order #{params.id}</p>
        <button
          onClick={() => router.push('/')}
          className="text-primary font-semibold"
        >
          Try Another Number
        </button>
      </main>
    );
  }

  const currentStep = getStepIndex(order ? order.status : null);

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Tracker</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          :root { --black: #000000; --green: #00FF41; --dark-green: #00a82d; --gray: #1a1a1a; --silver: #C0C0C0; }
          body { font-family: 'Courier New', monospace; background-color: var(--black); color: var(--green); line-height: 1.6; min-height: 100vh; }
          .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
          header { text-align: center; border-bottom: 1px solid var(--dark-green); padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
          .tagline { color: var(--silver); font-size: 0.9rem; margin-bottom: 15px; }
          .nav { display: flex; gap: 20px; }
          .nav a { color: var(--silver); text-decoration: none; font-size: 0.9rem; padding: 5px 10px; border: 1px solid var(--dark-green); transition: all 0.3s ease; }
          .nav a:hover, .nav a.active { color: var(--green); border-color: var(--green); }
          .terminal-prompt { color: var(--dark-green); }
          .post-list { list-style: none; }
          .post-item { border: 1px solid var(--dark-green); padding: 20px; margin-bottom: 20px; transition: all 0.3s ease; }
          .post-item:hover { border-color: var(--green); box-shadow: 0 0 10px rgba(0, 255, 65, 0.2); }
          .post-date { color: var(--silver); font-size: 0.8rem; margin-bottom: 10px; }
          .post-title { font-size: 1.3rem; margin-bottom: 10px; }
          .post-title a { color: var(--green); text-decoration: none; }
          .post-title a:hover { text-decoration: underline; }
          .post-excerpt { color: var(--dark-green); font-size: 0.9rem; }
          .tag { display: inline-block; background: var(--gray); color: var(--silver); padding: 2px 8px; font-size: 0.7rem; margin-right: 5px; border-radius: 2px; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--dark-green); text-align: center; color: var(--silver); font-size: 0.8rem; }
          .footer a { color: var(--silver); text-decoration: none; }
          .footer a:hover { color: var(--green); }
          .command { background: var(--gray); padding: 15px; border-left: 3px solid var(--green); margin: 20px 0; font-size: 0.85rem; }
          .step-container { display: flex; align-items: center; margin-bottom: 40px; }
          .step { display: flex; align-items: center; margin-right: 40px; }
          .step-number { font-size: 1.5rem; font-weight: bold; }
          .step-icon { width: 40px; height: 40px; }
          .step-label { font-size: 1rem; }
          .step-line { width: 60px; height: 2px; background: var(--gray); }
          .step-active { background: var(--green); height: 100%; }
          .step-completed { background: var(--green); height: 100%; }
          .step-pending { background: var(--gray); }
          .order-info { background: var(--gray); border: 1px solid var(--dark-green); padding: 20px; border-radius: 8px; margin-bottom: 40px; }
          .order-number { font-size: 3rem; font-weight: bold; color: var(--green); margin-bottom: 10px; }
          .order-details { margin-bottom: 20px; }
          .detail-label { color: var(--silver); font-size: 0.8rem; margin-bottom: 5px; }
          .detail-value { color: var(--green); font-size: 1.1rem; }
          .progress-bar { width: 100%; height: 8px; background: var(--gray); border-radius: 4px; }
          .progress { height: 100%; background: var(--green); border-radius: 4px; }
          .animate-pulse { animation: pulse 2s infinite; }
          @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="logo">INNERG INTEL</div>
            <div class="tagline">Become intelligence. Become INNERG.</div>
            <nav class="nav">
              <a href="../index.html">Blog</a>
              <a href="../about.html">About</a>
              <a href="../own-your-web.html">Own Your Web</a>
              <a href="../innerg-intel.html" class="active">InnerG Intel</a>
            </nav>
          </header>

          <main>
            <div class="order-info">
              <div class="order-number">Order #{order ? order.id : '...'}</div>
              <div class="order-details">
                <div class="detail-label">Status:</div>
                <div class="detail-value">{order ? order.status : 'Loading...'}</div>
                <div class="detail-label">Customer:</div>
                <div class="detail-value">{order ? (order.customerName || 'Loading...') : 'Loading...'}</div>
                <div class="detail-label">Items:</div>
                <div class="detail-value">{order ? (order.items && order.items.join(', ') : 'Loading...') : 'Loading...'}</div>
                <div class="detail-label">Updated:</div>
                <div class="detail-value">{order ? order.updatedAt : 'Loading...'}</div>
              </div>
            </div>

            <div class="step-container">
              {trackingSteps.slice(0, 4).map((step, idx) => (
                <div key={step.key} className="step">
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-icon">{React.createElement(step.icon, { size: 40 })}</div>
                  <div className="step-label">{step.label}</div>
                  <div className="step-line"></div>
                </div>
              ))}
            </div>

            <div class="progress-bar">
              <div className="progress" style={`width: ${currentStep !== -1 ? ((currentStep + 1) / 4) * 100 : 0}%`}></div>
            </div>
          </main>

          <footer>
            <p>Systems over platforms. Ownership over dependency.</p>
            <p style="margin-top: 10px;">
              <a href="https://innergclaw.github.io/ownyourweb-landing/" style="color: var(--silver); text-decoration: none;">Own Your Web</a> |
              <a href="https://innergclaw.github.io/innerg-intel-blog/" style="color: var(--silver); text-decoration: none;">InnerG Intel Blog</a> |
              <a href="https://discord.gg/CLAWD" style="color: var(--silver); text-decoration: none;">Discord</a>
            </p>
            <p style="margin-top: 20px; color: var(--dark-green);">Become intelligence. Become INNERG.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
