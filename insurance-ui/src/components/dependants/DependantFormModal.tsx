import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { dependantSchema, type DependantFormValues } from "../../schemas/dependant";
import { useCreateDependant } from "../../hooks/useDependants";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../api/client";
import type { PersonType } from "../../types/insurance";

interface DependantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  /** Which tab opened this modal — used to pre-select and label the right type. */
  context: "dependant" | "beneficiary";
  onSaved?: () => void;
}

const emptyValues: DependantFormValues = {
  name: "",
  dateOfBirth: "",
  idNumber: "",
  relationship: "",
  mobileNumber: "",
  email: "",
  type: "DEPENDANT",
};

export function DependantFormModal({ isOpen, onClose, customerId, context, onSaved }: DependantFormModalProps) {
  const { showToast } = useToast();
  const createDependant = useCreateDependant(customerId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DependantFormValues>({
    resolver: zodResolver(dependantSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset({ ...emptyValues, type: context === "beneficiary" ? "BENEFICIARY" : "DEPENDANT" });
    }
  }, [isOpen, context, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createDependant.mutateAsync({
        ...values,
        type: values.type as PersonType,
        customerId,
      });
      showToast({ tone: "success", title: `${context === "beneficiary" ? "Beneficiary" : "Dependant"} added` });
      onSaved?.();
      onClose();
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't save", description: getErrorMessage(err) });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={context === "beneficiary" ? "Add Beneficiary" : "Add Dependant"}
      description="This is stored on the same record as dependants, distinguished by type."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={createDependant.isPending}>
            Cancel
          </Button>
          <Button onClick={onSubmit} isLoading={createDependant.isPending}>
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full Name" error={errors.name?.message} className="sm:col-span-2">
          <Input {...register("name")} hasError={!!errors.name} placeholder="John Wanjiru" />
        </FormField>

        <FormField label="Type" error={errors.type?.message}>
          <Select {...register("type")} hasError={!!errors.type}>
            <option value="DEPENDANT">Dependant</option>
            <option value="BENEFICIARY">Beneficiary</option>
            <option value="NOMINATED">Nominated (required before PDF generation)</option>
            <option value="BOTH">Both (Dependant &amp; Beneficiary)</option>
          </Select>
        </FormField>

        <FormField label="Relationship" error={errors.relationship?.message}>
          <Input {...register("relationship")} hasError={!!errors.relationship} placeholder="Spouse, Child, Parent..." />
        </FormField>

        <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} hasError={!!errors.dateOfBirth} />
        </FormField>

        <FormField label="ID Number" hint="Optional" error={errors.idNumber?.message}>
          <Input {...register("idNumber")} hasError={!!errors.idNumber} />
        </FormField>

        <FormField label="Mobile Number" hint="Optional" error={errors.mobileNumber?.message}>
          <Input {...register("mobileNumber")} hasError={!!errors.mobileNumber} />
        </FormField>

        <FormField label="Email" hint="Optional" error={errors.email?.message}>
          <Input type="email" {...register("email")} hasError={!!errors.email} />
        </FormField>
      </form>
    </Modal>
  );
}
