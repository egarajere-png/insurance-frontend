import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { Stepper } from "../../components/ui/Stepper";
import { DependantFormModal } from "../../components/dependants/DependantFormModal";
import { PeopleStep } from "../../components/applications/PeopleStep";
import { SelectProductStep } from "../../components/applications/SelectProductStep";
import { HealthInfoStep } from "../../components/applications/HealthInfoStep";
import { ReviewStep } from "../../components/applications/ReviewStep";
import { useCreateApplication, useCustomerApplications } from "../../hooks/useApplications";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../api/client";
import { isHealthStepValid } from "../../schemas/application";
import { usePortalAuth } from "../context/usePortalAuth";
import type { Product } from "../../types/insurance";
import type { HealthInfoFormValues } from "../../schemas/application";

const STEPS = ["Dependants & Beneficiaries", "Product", "Health", "Review"];

const defaultHealth: HealthInfoFormValues = {
  inGoodHealth: "yes",
  healthStatus: "",
  specificDiasgnosis: "no",
  specificDiasgnosisStatus: "",
};

export default function PortalNewApplicationPage() {
  const { customer } = usePortalAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [health, setHealth] = useState<HealthInfoFormValues>(defaultHealth);
  const [isDependantFormOpen, setIsDependantFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: existingApplications } = useCustomerApplications(customer?.emailAddress);
  const createApplication = useCreateApplication(customer?.emailAddress ?? "");

  if (!customer) return null;

  const canProceed = () => {
    if (step === 1) return !!product;
    if (step === 2) return isHealthStepValid(health);
    return true;
  };

  const handleSubmit = async () => {
    if (!product || !isHealthStepValid(health)) return;
    try {
      await createApplication.mutateAsync({
        customerId: customer.id,
        productId: product.id,
        inGoodHealth: health.inGoodHealth === "yes",
        healthStatus: health.healthStatus,
        specificDiasgnosis: health.specificDiasgnosis === "yes",
        specificDiasgnosisStatus: health.specificDiasgnosisStatus,
      });
      setSubmitted(true);
      showToast({ tone: "success", title: "Application submitted", description: product.name });
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't submit application", description: getErrorMessage(err) });
    }
  };

  if (submitted && product) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-50 text-success-700">
          <CheckCircle2 className="size-7" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Application submitted</h1>
        <p className="mt-1 text-sm text-slate-500">Your application for {product.name} has been recorded.</p>

        <Card className="mt-6 text-left">
          <CardBody>
            <div className="flex items-center gap-2 text-warning-700">
              <Clock className="size-4" />
              <p className="text-sm font-medium">Pending Review</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">The bank will review your application before it's approved.</p>
          </CardBody>
        </Card>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/portal/applications">
            <Button>Back to My Applications</Button>
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

      <PageHeader title="New Insurance Application" description="Complete each step to submit your application." />

      <Stepper steps={STEPS} currentStep={step} />

      <div className="mb-6">
        {step === 0 && <PeopleStep customerId={customer.id} onAdd={() => setIsDependantFormOpen(true)} />}
        {step === 1 && <SelectProductStep selected={product} onSelect={setProduct} existingApplications={existingApplications} />}
        {step === 2 && <HealthInfoStep value={health} onChange={setHealth} />}
        {step === 3 && product && <ReviewStep customer={customer} product={product} health={health} />}
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
          <Button onClick={handleSubmit} isLoading={createApplication.isPending} disabled={!isHealthStepValid(health)}>
            Submit Application
          </Button>
        )}
      </div>

      <DependantFormModal
        isOpen={isDependantFormOpen}
        onClose={() => setIsDependantFormOpen(false)}
        customerId={customer.id}
        context="dependant"
      />
    </div>
  );
}
