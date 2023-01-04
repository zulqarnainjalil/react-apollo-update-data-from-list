import * as React from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
const IssueGroupSchema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
});
const UPDATE_ISSUE_GROUP = gql`mutation UpdateIssueGroup($id: String, $title: String, $description: String) {
  update_IssueGroup(where: {id: {_eq: $id}}, _set: {title: $title, description: $description}) {
    returning {
      title
      description
    }
  }
}
`;
export default function AdminUpdateIssueGroupForm({
  IssueGroupData,
  setUpdatedData,
}) {
  const [title, setTitle] = React.useState(IssueGroupData.title);
  const [description, setDescription] = React.useState(
    IssueGroupData.description
  );
  const [updateIssueGroup, { loading, error }] =
    useMutation(UPDATE_ISSUE_GROUP);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    return new Promise((resolve) => {
      updateIssueGroup({
        variables: {
          id: IssueGroupData.id,
          title: data.title,
          description: data.description,
        },
      }).then(
        (res) => {
          console.log(
            'res.data.UpdateIssueGroup.returning[0] => ',
            res.data.update_IssueGroup
          );
          let res_data = res.data.update_IssueGroup.returning[0]          ;
          
      setUpdatedData({
        title: res_data.title,
        description: res_data.description,
        id: IssueGroupData.id,
      });
          resolve(true);
        },
        (err) => {
          console.log('err => ', err);
          resolve(true);
        }
      );
    });
  }
  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">First name</FormLabel>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                name="title"
                placeholder="title"
                defaultValue={title}
                {...register('title', {
                  required: 'This is required',
                  minLength: {
                    value: 4,
                    message: 'Minimum length should be 4',
                  },
                })}
              />
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                defaultValue={description}
                {...register('description', {
                  required: 'This is required',
                  minLength: {
                    value: 4,
                    message: 'Minimum length should be 4',
                  },
                })}
                placeholder="description"
                name="description"
                label="Describe"
                rows={4}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </>
  );
}
