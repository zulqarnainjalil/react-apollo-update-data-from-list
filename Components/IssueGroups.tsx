import * as React from 'react';
import { gql, useLazyQuery } from '@apollo/client';

import {
  Button,
  Modal,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import AdminUpdateIssueGroupForm from '../Components/AdminUpdateIssueGroupForm';
import { useState } from 'react';
const GET_ALL_ISSUE_GROUPS = gql`query GetAllIssueGroups {
  IssueGroup {
    title
    description
    id
    createdAt
  }
}`;
export default function IssueGroups() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loadGreeting, { error, called, loading, data }] = useLazyQuery(
    GET_ALL_ISSUE_GROUPS,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const [modalValue, setModalValue] = useState({});
  function handleEditClick(data) {
    setModalValue(data);
    setIsOpen(true);
  }
  React.useEffect(() => {
    loadGreeting();
  }, []);
  const setUpdatedData = (obj) => {
    toast({
      title: 'Update Success.',
      description: 'Issue group is updated successfuly',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    loadGreeting();
    setIsOpen(false);
  };
  if (loading)
    return (
      <Stack direction="row" spacing={4}>
        {' '}
        <Spinner size="xl" />
      </Stack>
    );
  if (error) return <p>Error : {error.message}</p>;
  return (
    <>
      <Modal
        onClose={() => {
          setIsOpen(false);
        }}
        isOpen={isOpen}
        size="full"
      >
        <AdminUpdateIssueGroupForm
          IssueGroupData={modalValue}
          setUpdatedData={setUpdatedData}
        />
      </Modal>
      {!loading && (
        <TableContainer>
          <Table variant="simple">
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Date</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.IssueGroup.map((group) => (
                  <Tr key={group.id}>
                    <Td>{group.title}</Td>
                    <Td>{group.description}</Td>
                    <Td>{group.createdAt}</Td>
                    <Td>
                      <Button
                        onClick={() => {
                          handleEditClick(group);
                        }}
                      >
                        {' '}
                        Edit{' '}
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
