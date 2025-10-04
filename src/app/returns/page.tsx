export default function ReturnsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-center font-headline">
        Return Policy
      </h1>
      <div className="prose prose-lg mx-auto max-w-none text-foreground">
        <p>
          Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.
        </p>
        <p>
          To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
        </p>
        
        <h2>Refunds (if applicable)</h2>
        <p>
          Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
        </p>

        <h2>Exchanges (if applicable)</h2>
        <p>
          We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@minimalistmercantile.com.
        </p>

        <h2>Shipping</h2>
        <p>
          To return your product, you should mail your product to our warehouse address, which will be provided upon request. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
        </p>
      </div>
    </div>
  );
}
