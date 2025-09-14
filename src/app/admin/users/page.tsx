import { deleteUser, getAllUsers } from "@/actions/admin";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/user";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Users",
};

type AdminUsersPageProps = {
  searchParams: Promise<{ page: string }>;
};

const AdminUsersPage = async (props: AdminUsersPageProps) => {
  const { page = "1" } = await props?.searchParams;

  const { users, totalPages } = await getAllUsers({
    page: Number(page),
  });

    return (
    <>
      <div className="space-y-2">
        <h2 className="h2-bold">Users</h2>
        {users?.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{formatId(user.id)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user?.role === USER_ROLES.USER ? (
                        <Badge variant="secondary">{user.role}</Badge>
                      ) : (
                        <Badge>{user.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${ROUTES.ADMIN_USERS}/${user.id}`}>Edit</Link>
                      </Button>
                      <DeleteDialog id={user.id} action={deleteUser} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination page={Number(page) || 1} totalPages={totalPages} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsersPage;
