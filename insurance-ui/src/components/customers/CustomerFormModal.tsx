import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { customerSchema, type CustomerFormValues } from "../../schemas/customer";
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useCustomers";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../api/client";
import type { Customer } from "../../types/insurance";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onSaved?: (customer: Customer) => void;
}

const emptyValues: CustomerFormValues = {
  name: "",
  dateOfBirth: "",
  idNumber: "",
  pinNumber: "",
  occupation: "",
  gender: "",
  mobileNumber: "",
  emailAddress: "",
  postalAddress: "",
  postalCode: "",
  city: "",
};

export function CustomerFormModal({ isOpen, onClose, customer, onSaved }: CustomerFormModalProps) {
  const isEdit = !!customer;
  const { showToast } = useToast();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (customer) {
      reset({
        name: customer.name ?? "",
        dateOfBirth: customer.dateOfBirth?.slice(0, 10) ?? "",
        idNumber: customer.idNumber ?? "",
        pinNumber: customer.pinNumber ?? "",
        occupation: customer.occupation ?? "",
        gender: customer.gender ?? "",
        mobileNumber: customer.mobileNumber ?? "",
        emailAddress: customer.emailAddress ?? "",
        postalAddress: customer.postalAddress ?? "",
        postalCode: customer.postalCode ?? "",
        city: customer.city ?? "",
      });
    } else {
      reset(emptyValues);
    }
  }, [isOpen, customer, reset]);

  const isSaving = createCustomer.isPending || updateCustomer.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = isEdit
        ? await updateCustomer.mutateAsync({ id: customer!.id, ...values })
        : await createCustomer.mutateAsync(values);
      showToast({
        tone: "success",
        title: isEdit ? "Customer updated" : "Customer created",
        description: result.name,
      });
      onSaved?.(result);
      onClose();
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't save customer", description: getErrorMessage(err) });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Customer" : "New Customer"}
      description={isEdit ? "Update this customer's information." : "Register a new customer."}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} isLoading={isSaving}>
            {isEdit ? "Save Changes" : "Create Customer"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full Name" error={errors.name?.message} className="sm:col-span-2">
          <Input {...register("name")} hasError={!!errors.name} placeholder="Jane Wanjiru" />
        </FormField>

        <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} hasError={!!errors.dateOfBirth} />
        </FormField>

        <FormField label="Gender" error={errors.gender?.message}>
          <Select {...register("gender")} hasError={!!errors.gender} defaultValue="">
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </FormField>

        <FormField label="ID Number" error={errors.idNumber?.message}>
          <Input {...register("idNumber")} hasError={!!errors.idNumber} placeholder="12345678" />
        </FormField>

        <FormField label="KRA PIN" error={errors.pinNumber?.message}>
          <Input {...register("pinNumber")} hasError={!!errors.pinNumber} placeholder="A012345678B" />
        </FormField>

        <FormField label="Occupation" error={errors.occupation?.message}>
          <Input {...register("occupation")} hasError={!!errors.occupation} placeholder="Software Developer" />
        </FormField>

        <FormField label="Mobile Number" error={errors.mobileNumber?.message}>
          <Input {...register("mobileNumber")} hasError={!!errors.mobileNumber} placeholder="0712345678" />
        </FormField>

        <FormField label="Email Address" error={errors.emailAddress?.message} className="sm:col-span-2">
          <Input type="email" {...register("emailAddress")} hasError={!!errors.emailAddress} placeholder="jane@example.com" disabled={isEdit} />
        </FormField>

        <FormField label="Postal Address" error={errors.postalAddress?.message}>
          <Input {...register("postalAddress")} hasError={!!errors.postalAddress} placeholder="P.O. Box 1234" />
        </FormField>

        <FormField label="Postal Code" error={errors.postalCode?.message}>
          <Input {...register("postalCode")} hasError={!!errors.postalCode} placeholder="00100" />
        </FormField>

        <FormField label="City" error={errors.city?.message} className="sm:col-span-2">
          <Input {...register("city")} hasError={!!errors.city} placeholder="Nairobi" />
        </FormField>
      </form>
    </Modal>
  );
}
