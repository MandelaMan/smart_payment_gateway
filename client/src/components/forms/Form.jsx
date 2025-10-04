import React from "react";
import { useForm, FormProvider } from "react-hook-form";

const Form = ({ defaultValues = {}, onSubmit, children, className = "" }) => {
  const methods = useForm({ defaultValues, mode: "onChange" });

  return (
    <FormProvider {...methods}>
      <form
        className={`ui-form ${className}`}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
