import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Account Signup</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">创建账号</h1>
        <p className="mt-3 text-slate-600">
          普通用户可以在这里自己设定邮箱和密码。管理员账号不通过注册页创建。
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
