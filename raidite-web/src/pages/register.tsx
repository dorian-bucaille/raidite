import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(values, handleChanges) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                onChange={handleChanges}
              />
              {/* <FormErrorMessage>{values.username}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
