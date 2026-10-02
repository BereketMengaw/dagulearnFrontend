import { Wallet } from "lucide-react";
import StudioShell, { Card } from "@/components/studio/StudioShell";

export default function CreatorAgreementPage() {
  return (
    <StudioShell
      title="Creator agreement"
      subtitle="The terms between DaguLearn and the creators who teach on it."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
        <Card className="sm:p-10">
          {/* Agreement Terms */}
          <div className="max-w-3xl space-y-4 leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:border-t [&_h2]:border-slate-100 [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2:first-child]:mt-0 [&_h2:first-child]:border-0 [&_h2:first-child]:pt-0 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mt-1.5 [&_li]:marker:text-brand-500 [&_strong]:text-slate-900">
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
              Creator&apos;s content, and any outstanding payments will be
              settled within 30 days.
            </p>

            <h2 className="text-xl font-semibold">Amendments</h2>
            <p>
              The Platform reserves the right to amend this Agreement at any
              time. Creators will be notified of any changes, and continued use
              of the Platform constitutes acceptance of the updated terms.
            </p>
          </div>
        </Card>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={20} />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">80 / 20</p>
            <p className="mt-1 text-sm text-slate-500">
              You keep 80% of every sale. DaguLearn keeps 20% to run the platform.
            </p>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-slate-900">Payouts</p>
            <p className="mt-1 text-sm text-slate-500">
              Paid to your bank account at the end of each month.
            </p>
          </Card>
        </aside>
      </div>
    </StudioShell>
  );
}
