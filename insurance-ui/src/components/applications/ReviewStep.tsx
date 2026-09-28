import { Card, CardBody, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { Customer, Product } from "../../types/insurance";
import type { HealthInfoFormValues } from "../../schemas/application";

export function ReviewStep({
  customer,
  product,
  health,
}: {
  customer: Customer;
  product: Product;
  health: HealthInfoFormValues;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Customer" />
        <CardBody className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Name</p>
            <p className="font-medium text-slate-900">{customer.name}</p>
          </div>
          <div>
            <p className="text-slate-500">Email</p>
            <p className="font-medium text-slate-900">{customer.emailAddress}</p>
          </div>
          <div>
            <p className="text-slate-500">ID Number</p>
            <p className="font-medium text-slate-900">{customer.idNumber}</p>
          </div>
          <div>
            <p className="text-slate-500">Mobile</p>
            <p className="font-medium text-slate-900">{customer.mobileNumber}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Selected Product" />
        <CardBody className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium text-slate-900">{product.name}</p>
            <p className="text-slate-500">{product.description}</p>
          </div>
          <Badge tone={product.plan === "Pro" ? "brand" : "neutral"}>{product.plan}</Badge>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Health Information" />
        <CardBody className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">In good health</span>
            <Badge tone={health.inGoodHealth === "yes" ? "success" : "warning"}>
              {health.inGoodHealth === "yes" ? "Yes" : "No"}
            </Badge>
          </div>
          {health.inGoodHealth === "no" && health.healthStatus && (
            <p className="text-slate-700">{health.healthStatus}</p>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Specific diagnosis declared</span>
            <Badge tone={health.specificDiasgnosis === "yes" ? "warning" : "neutral"}>
              {health.specificDiasgnosis === "yes" ? "Yes" : "No"}
            </Badge>
          </div>
          {health.specificDiasgnosis === "yes" && health.specificDiasgnosisStatus && (
            <p className="text-slate-700">{health.specificDiasgnosisStatus}</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
