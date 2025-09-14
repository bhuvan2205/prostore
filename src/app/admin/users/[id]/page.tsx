import { getUserById } from "@/actions/user";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import UpdateUserForm from "../../_components/update-user-form";
import { UpdateUser } from "@/types";

export const metadata: Metadata = {
  title: "Update User",
};

type AdminUsersUpdatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const AdminUsersUpdatePage = async (props: AdminUsersUpdatePageProps) => {
  const { id } = (await props?.params) || {};

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user as UpdateUser} />
    </div>
  );
};

export default AdminUsersUpdatePage;
