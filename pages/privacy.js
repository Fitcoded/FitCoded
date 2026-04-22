import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — FitCoded</title>
        <meta name="description" content="FitCoded Privacy Policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="root">
        <div className="container">

          <div className="header">
            <Link href="/" className="back-link">← Back to FitCoded</Link>
            <div className="badge">FITCODED</div>
            <h1 className="title">Privacy Policy</h1>
            <p className="updated">Last updated: April 2026</p>
          </div>

          <div className="section">
            <h2>Overview</h2>
            <p>FitCoded ("we", "us", or "our") operates the website fitcoded.shop (the "Service"). This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service.</p>
          </div>

          <div className="section">
            <h2>Information We Collect</h2>
            <p>When you use FitCoded, we collect the following information that you voluntarily provide through our style questionnaire:</p>
            <ul>
              <li>Gender</li>
              <li>Body type</li>
              <li>Skin tone</li>
              <li>Season preference</li>
              <li>Budget range</li>
              <li>Lifestyle</li>
              <li>Style goal</li>
            </ul>
            <p>This information is used solely to generate your personalized style profile. We do not require you to create an account or provide your name, email address or any other personally identifiable information to use FitCoded.</p>
          </div>

          <div className="section">
            <h2>How We Use Your Information</h2>
            <p>The information you provide is used exclusively to:</p>
            <ul>
              <li>Generate your personalized color palette and style recommendations</li>
              <li>Suggest outfit combinations appropriate for your profile</li>
              <li>Improve the accuracy and quality of our style recommendations</li>
            </ul>
          </div>

          <div className="section">
            <h2>Third-Party Services</h2>
            <p>FitCoded uses the following third-party services:</p>
            <ul>
              <li><strong>Anthropic API</strong> — We use Anthropic's AI API to generate style recommendations. Your style questionnaire responses are sent to Anthropic's servers to generate your profile. Anthropic's privacy policy is available at anthropic.com.</li>
              <li><strong>Amazon Associates</strong> — FitCoded participates in the Amazon Services LLC Associates Program, an affiliate advertising program. When you click Amazon links, you will be directed to Amazon.com. Amazon may collect data in accordance with their privacy policy.</li>
              <li><strong>ASOS</strong> — FitCoded may include links to ASOS. When you click these links, ASOS may collect data in accordance with their privacy policy.</li>
              <li><strong>Vercel</strong> — Our Service is hosted on Vercel. Vercel may collect standard server logs including IP addresses and browser information.</li>
            </ul>
          </div>

          <div className="section">
            <h2>Cookies</h2>
            <p>FitCoded does not use tracking cookies or advertising cookies. We do not track your browsing behavior across other websites.</p>
          </div>

          <div className="section">
            <h2>Data Retention</h2>
            <p>FitCoded does not store your questionnaire responses after your style profile is generated. Each session is independent and your answers are not saved to any database.</p>
          </div>

          <div className="section">
            <h2>Children's Privacy</h2>
            <p>FitCoded is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          </div>

          <div className="section">
            <h2>Affiliate Disclosure</h2>
            <p>FitCoded participates in affiliate marketing programs. This means we may earn a commission when you click on certain product links and make a purchase. This comes at no additional cost to you. We only recommend products we believe are relevant to your style profile.</p>
          </div>

          <div className="section">
            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective immediately upon posting.</p>
          </div>

          <div className="section">
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <strong>hello@fitcoded.shop</strong>.</p>
          </div>

        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0ede8; font-family: Georgia, serif; }
        .root { min-height: 100vh; padding: 40px 20px 80px; display: flex; justify-content: center; }
        .container { max-width: 640px; width: 100%; }
        .header { margin-bottom: 48px; }
        .back-link { font-size: 12px; color: #555; font-family: Arial, sans-serif; text-decoration: none; letter-spacing: 0.05em; display: inline-block; margin-bottom: 32px; }
        .back-link:hover { color: #c9a96e; }
        .badge { display: inline-block; font-size: 10px; letter-spacing: 0.25em; color: #c9a96e; border: 1px solid #c9a96e; padding: 4px 12px; margin-bottom: 16px; font-family: Arial, sans-serif; }
        .title { font-size: clamp(28px, 6vw, 42px); font-weight: 400; color: #f0ede8; margin-bottom: 8px; }
        .updated { font-size: 12px; color: #444; font-family: Arial, sans-serif; letter-spacing: 0.05em; }
        .section { margin-bottom: 36px; border-top: 1px solid #1e1e1e; padding-top: 28px; }
        .section h2 { font-size: 13px; letter-spacing: 0.15em; color: #c9a96e; font-family: Arial, sans-serif; font-weight: 400; margin-bottom: 14px; text-transform: uppercase; }
        .section p { font-size: 14px; color: #888; font-family: Arial, sans-serif; line-height: 1.8; margin-bottom: 12px; }
        .section ul { padding-left: 20px; margin-bottom: 12px; }
        .section ul li { font-size: 14px; color: #888; font-family: Arial, sans-serif; line-height: 1.8; }
        .section strong { color: #bbb; }
      `}</style>
    </>
  );
}
