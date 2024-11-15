import z from "zod";
const login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signup_schema = z
  .object({
    username: z.string().min(2, "username must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["password_confirmation"],
      });
    }
  });

const idea_schema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(30, "Maximum of 30 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Maximum of 300 characters"),
  category_id: z.string().refine((val) => {
    const id = Number(val);
    return id >= 1 && id <= 14;
  }, "Invalid category id"),
  project_id: z.string().uuid("Invalid project id"),
});
const comment_schmea = z.object({
  content: z.string().min(2, "Comment must be at least 2 characters"),
});

const project_schema = z.object({
  name: z.string().min(2, "Project Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  url: z.string().url("Invalid URL"),
});

export {
  login_schema,
  signup_schema,
  idea_schema,
  comment_schmea,
  project_schema,
};
