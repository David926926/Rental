import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Account Signup</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-3 text-slate-600">
          Regular users can set up their own email and password here. Admin accounts are not created through this page.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
