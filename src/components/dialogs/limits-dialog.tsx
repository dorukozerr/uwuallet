import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateLimits } from "@/actions/limits";
import { limitsFormSchema } from "@/lib/schemas";
import {
  limitsFormInitialValues,
  LimitsFormDescriptions,
} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const LimitsDialog = ({
  open,
  onOpenChange,
  limits,
}: {
  open: boolean;
  onOpenChange: () => void;
  limits: z.infer<typeof limitsFormSchema> | null;
}) => {
  const form = useForm<z.infer<typeof limitsFormSchema>>({
    resolver: zodResolver(limitsFormSchema),
    defaultValues: limitsFormInitialValues,
  });

  useEffect(() => {
    if (limits) {
      form.reset(limits);
    } else {
      form.reset(limitsFormInitialValues);
    }
  }, [limits, form]);

  const onSubmit = async (values: z.infer<typeof limitsFormSchema>) => {
    const res = await updateLimits({ limits: values });

    if (res.success) onOpenChange();

    toast(res.message);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(600px,95vh)] max-w-[min(800px,95vw)] flex-col rounded-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Remove This Transaction</DialogTitle>
          <DialogDescription>
            Configure your spending limits from here. 0 means no limit for that
            particular group.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-4 overflow-auto border-b border-t border-border px-1 py-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Object.keys(limitsFormInitialValues).map((fieldName, index) => (
              <FormField
                key={`limitConfigurationFormField-${index}`}
                control={form.control}
                name={fieldName as keyof typeof limitsFormInitialValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{fieldName}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription className="capitalize">
                      {
                        LimitsFormDescriptions[
                          fieldName as keyof typeof LimitsFormDescriptions
                        ]
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <button className="hidden" type="submit"></button>
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={onOpenChange} variant="outline">
            Close
          </Button>
          <Button onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
