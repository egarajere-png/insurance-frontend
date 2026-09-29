import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { productSchema, type ProductFormValues } from "../../schemas/product";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../api/client";
import type { Product } from "../../types/insurance";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When set, the modal edits this product instead of creating a new one. */
  product?: Product;
  onSaved?: () => void;
}

const emptyValues: ProductFormValues = {
  name: "",
  description: "",
  plan: "Basic",
  benefit: 0,
  benefitChild: 0,
  premium: 0,
  premiumAdditionalChild: 0,
  premiumAdditionalAdultChild: 0,
};

export function ProductFormModal({ isOpen, onClose, product, onSaved }: ProductFormModalProps) {
  const isEdit = !!product;
  const { showToast } = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        plan: product.plan,
        benefit: product.benefit,
        benefitChild: product.benefitChild,
        premium: product.premium,
        premiumAdditionalChild: product.premiumAdditionalChild,
        premiumAdditionalAdultChild: product.premiumAdditionalAdultChild,
      });
    } else {
      reset(emptyValues);
    }
  }, [isOpen, product, reset]);

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = isEdit
        ? await updateProduct.mutateAsync({ id: product!.id, payload: values })
        : await createProduct.mutateAsync(values);
      showToast({ tone: "success", title: isEdit ? "Product updated" : "Product created", description: saved.name });
      onSaved?.();
      onClose();
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't save product", description: getErrorMessage(err) });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Insurance Product" : "New Insurance Product"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} isLoading={isSaving}>
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Product Name" error={errors.name?.message} className="sm:col-span-2">
          <Input {...register("name")} hasError={!!errors.name} placeholder="Family Shield Cover" />
        </FormField>

        <FormField label="Plan" error={errors.plan?.message}>
          <Select {...register("plan")} hasError={!!errors.plan}>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
          </Select>
        </FormField>

        <FormField label="Premium (KES)" error={errors.premium?.message}>
          <Input type="number" step="0.01" {...register("premium", { valueAsNumber: true })} hasError={!!errors.premium} />
        </FormField>

        <FormField label="Description" error={errors.description?.message} className="sm:col-span-2">
          <Textarea rows={3} {...register("description")} hasError={!!errors.description} />
        </FormField>

        <FormField label="Benefit (KES)" error={errors.benefit?.message}>
          <Input type="number" step="0.01" {...register("benefit", { valueAsNumber: true })} hasError={!!errors.benefit} />
        </FormField>

        <FormField label="Child Benefit (KES)" error={errors.benefitChild?.message}>
          <Input type="number" step="0.01" {...register("benefitChild", { valueAsNumber: true })} hasError={!!errors.benefitChild} />
        </FormField>

        <FormField label="Additional Child Premium (KES)" error={errors.premiumAdditionalChild?.message}>
          <Input
            type="number"
            step="0.01"
            {...register("premiumAdditionalChild", { valueAsNumber: true })}
            hasError={!!errors.premiumAdditionalChild}
          />
        </FormField>

        <FormField label="Additional Adult/Child Premium (KES)" error={errors.premiumAdditionalAdultChild?.message}>
          <Input
            type="number"
            step="0.01"
            {...register("premiumAdditionalAdultChild", { valueAsNumber: true })}
            hasError={!!errors.premiumAdditionalAdultChild}
          />
        </FormField>
      </form>
    </Modal>
  );
}
