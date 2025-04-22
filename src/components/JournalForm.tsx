'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

const FormSchema = z.object({
  date: z.date({
    required_error: 'A date is required.',
  }),
  entry: z
    .string()
    .min(10, { message: 'Journal entry must be at least 10 characters.' })
    .max(500, { message: 'Journal entry must not exceed 500 characters.' }),
});

export default function JournalForm({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(), // Default to today's date
      entry: '',
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between w-full max-w-7xl mx-auto">
      {/* Left Side: Image */}
      <div className="flex justify-center">
        <img
          src="/images/boy-with-headphones-listening-to.jpg" // Replace with your image path
          alt="Journal Illustration"
          className="w-full max-w-lg object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Right Side: Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* Date Picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full md:w-[240px] pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Journal Entry */}
          <FormField
            control={form.control}
            name="entry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal Entry</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your journal entry here..."
                    className="resize-none w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">
            Save Entry
          </Button>
        </form>
      </Form>
    </div>
  );
}
