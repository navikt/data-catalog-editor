import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Textarea} from "baseui/textarea";
import {SIZE as InputSIZE} from "baseui/input";
import * as React from "react";

const FieldDescription = () => (
  <Field
    name='description'
    render={({field, form}: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} type='input' size={InputSIZE.default}
                error={!!form.errors.description && form.touched.description}/>
    )}
  />
)

export default FieldDescription
