import Navbar from "@/components/Navbar/Navbar";

export default function CreatorAgreementPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Creator Agreement
          </h1>

          {/* Agreement Terms */}
          <div className="space-y-6 text-gray-700">
            <h2 className="text-xl font-semibold">Introduction</h2>
            <p>
              This Creator Agreement is entered into between Dagulearn and the
              Creators(teachers). This Agreement governs the relationship
              between the Platform and the Creator regarding the creation,
              distribution, and monetization of content on the Platform.
            </p>

            <h2 className="text-xl font-semibold">
              Roles and Responsibilities
            </h2>
            <h3 className="text-lg font-semibold">Platform Responsibilities</h3>
            <ul className="list-disc pl-6">
              <li>
                Provide a secure and functional platform for content hosting and
                distribution.
              </li>
              <li>
                Handle payment processing and ensure timely payouts to Creators.
              </li>
              <li>
                Promote content to potential buyers through marketing and
                advertising.
              </li>
              <li>Provide customer support for buyers and Creators.</li>
              <li>Ensure compliance with Ethiopian laws and regulations.</li>
            </ul>

            <h3 className="text-lg font-semibold">Creator Responsibilities</h3>
            <ul className="list-disc pl-6">
              <li>
                Create high-quality, original content that complies with
                Ethiopian laws and Platform guidelines.
              </li>
              <li>
                Upload private YouTube videos to the Platform for exclusive
                access by buyers.
              </li>
              <li>
                Ensure that all content is free from copyright infringement,
                offensive material, or illegal content.
              </li>
            </ul>

            <h2 className="text-xl font-semibold">Income Sharing</h2>
            <p>Earnings from content sales will be distributed as follows:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>80% to the Creator</strong>: You will receive 80% of the
                revenue generated from your content.
              </li>
              <li>
                <strong>20% to the Platform</strong>: The Platform will retain
                20% of the revenue for operational and maintenance costs.
              </li>
            </ul>

            <h2 className="text-xl font-semibold">Content Access</h2>
            <p>
              Creators are required to upload private YouTube videos to the
              Platform. These videos will be accessible only to buyers who have
              purchased the content. The Platform will ensure that access is
              restricted to authorized users only.
            </p>

            <h2 className="text-xl font-semibold">
              Compliance with Ethiopian Laws
            </h2>
            <p>
              Both the Platform and the Creator agree to comply with all
              applicable Ethiopian laws and regulations, including but not
              limited to:
            </p>
            <ul className="list-disc pl-6">
              <li>Copyright laws.</li>
              <li>Tax regulations.</li>
              <li>Data protection and privacy laws.</li>
            </ul>

            <h2 className="text-xl font-semibold">Termination</h2>
            <p>
              Either party may terminate this Agreement at any time with written
              notice. Upon termination, the Platform will remove the
              Creator&quot;s content, and any outstanding payments will be
              settled within 30 days.
            </p>

            <h2 className="text-xl font-semibold">Amendments</h2>
            <p>
              The Platform reserves the right to amend this Agreement at any
              time. Creators will be notified of any changes, and continued use
              of the Platform constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
