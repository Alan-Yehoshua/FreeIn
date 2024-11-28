import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://unvdzinvsutaijwtcszz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudmR6aW52c3V0YWlqd3Rjc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MDI3NDIsImV4cCI6MjA0MzI3ODc0Mn0.FxeeBmYRANGJJpXzKoPR9xWcB4ozARj8H5VHqkg9_AE"
);