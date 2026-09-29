import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Stepper } from "../components/ui/Stepper";
import { CustomerFormModal } from "../components/customers/CustomerFormModal";
import { DependantFormModal } from "../components/dependants/DependantFormModal";
import { SelectCustomerStep } from "../components/applications/SelectCustomerStep";
import { DependantsReviewStep } from "../components/applications/DependantsReviewStep";
import { SelectProductStep } from "../components/applications/SelectProductStep";
import { HealthInfoStep } from "../components/applications/HealthInfoStep";
import { ReviewStep } from "../components/applications/ReviewStep";
import { useCustomer } from "../hooks/useCustomers";
import { useCreateApplication } from "../hooks/useApplications";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../api/client";
import type { Customer, Product } from "../types/insurance";
import type { HealthInfoFormValues } from "../schemas/application";

const STEPS = ["Customer", "Dependants", "Beneficiaries", "Product", "Health", "Review"];

const defaultHealth: HealthInfoFormValues = {
  inGoodHealth: "yes",
  healthStatus: "",
  specificDiasgnosis: "no",
  specificDiasgnosisStatus: "",
};

export default function ApplicationWizardPage() {
  const [searchParams] = useSearchParams();
  const prefillEmail = searchParams.get("email") ?? undefined;
  const { data: prefillCustomer } = useCustomer(prefillEmail);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [health, setHealth] = useState<HealthInfoFormValues>(defaultHealth);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isDependantFormOpen, setIsDependantFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const effectiveCustomer = customer ?? prefillCustomer ?? null;

  const createApplication = useCreateApplication(effectiveCustomer?.emailAddress ?? "");

  const canProceed = () => {
    if (step === 0) return !!effectiveCustomer;
    if (step === 3) return !!product;
    return true;
  };

  const handleSubmit = async () => {
    if (!effectiveCustomer || !product) return;
    try {
      await createApplication.mutateAsync({
        customerId: effectiveCustomer.id,
        productId: product.id,
        inGoodHealth: health.inGoodHealth === "yes",
        healthStatus: health.healthStatus,
        specificDiasgnosis: health.specificDiasgnosis === "yes",
        specificDiasgnosisStatus: health.specificDiasgnosisStatus,
      });
      setSubmitted(true);
      showToast({ tone: "success", title: "Application submitted", description: `${effectiveCustomer.name} — ${product.name}` });
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't submit application", description: getErrorMessage(err) });
    }
  };

  if (submitted && effectiveCustomer && product) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-50 text-success-700">
          <CheckCircle2 className="size-7" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Application submitted</h1>
        <p className="mt-1 text-sm text-slate-500">
          {effectiveCustomer.name}'s application for {product.name} has been recorded.
        </p>

        <Card className="mt-6 text-left">
          <CardBody>
            <div className="flex items-center gap-2 text-warning-700">
              <Clock className="size-4" />
              <p className="text-sm font-medium">Pending Review</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              The application now needs an admin decision before the insurance document can be issued. Make sure the customer
              has a dependant typed "Nominated" on file — it's required before this can be approved.
            </p>
          </CardBody>
        </Card>

        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/customers/${encodeURIComponent(effectiveCustomer.emailAddress)}`}>
            <Button variant="outline">Back to Customer</Button>
          </Link>
          <Link to="/applications">
            <Button>Review in Applications</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back
      </button>

      <PageHeader title="New Insurance Application" description="Complete each step to submit a customer's application." />

      <Stepper steps={STEPS} currentStep={step} />

      <div className="mb-6">
        {step === 0 && (
          <SelectCustomerStep selected={effectiveCustomer} onSelect={setCustomer} onCreateNew={() => setIsCustomerFormOpen(true)} />
        )}
        {step === 1 && effectiveCustomer && (
          <DependantsReviewStep customerId={effectiveCustomer.id} kind="dependant" onAdd={() => setIsDependantFormOpen(true)} />
        )}
        {step === 2 && effectiveCustomer && (
          <DependantsReviewStep customerId={effectiveCustomer.id} kind="beneficiary" onAdd={() => setIsDependantFormOpen(true)} />
        )}
        {step === 3 && <SelectProductStep selected={product} onSelect={setProduct} />}
        {step === 4 && <HealthInfoStep value={health} onChange={setHealth} />}
        {step === 5 && effectiveCustomer && product && <ReviewStep customer={effectiveCustomer} product={product} health={health} />}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Previous
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            Next <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={createApplication.isPending}>
            Submit Application
          </Button>
        )}
      </div>

      <CustomerFormModal
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSaved={(c) => setCustomer(c)}
      />
      {effectiveCustomer && (
        <DependantFormModal
          isOpen={isDependantFormOpen}
          onClose={() => setIsDependantFormOpen(false)}
          customerId={effectiveCustomer.id}
          context={step === 2 ? "beneficiary" : "dependant"}
        />
      )}
    </div>
  );
}
