import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  disabled: boolean;
  label: string;
  value: string;
}

function flattenOptions(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) {
      return [];
    }

    const props = child.props as {
      children?: React.ReactNode;
      disabled?: boolean;
      value?: string;
    };

    if (child.type === React.Fragment) {
      return flattenOptions(props.children);
    }

    if (typeof child.type === "string" && child.type.toLowerCase() === "option") {
      return [
        {
          disabled: Boolean(props.disabled),
          label: String(props.children ?? ""),
          value: String(props.value ?? ""),
        },
      ];
    }

    return [];
  });
}

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ children, className, disabled, onChange, value, ...props }, ref) => {
    const options = React.useMemo(() => flattenOptions(children), [children]);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const stringValue = value === undefined || value === null ? "" : String(value);
    const selectedOption =
      options.find((option) => option.value === stringValue) ??
      options.find((option) => option.value === "") ??
      null;

    const filteredOptions = React.useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return options;
      }

      return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
    }, [options, query]);

    React.useEffect(() => {
      if (!open) {
        setQuery("");
        return;
      }

      const handlePointerDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);

      const timeoutId = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);

      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        window.clearTimeout(timeoutId);
      };
    }, [open]);

    const handleSelect = (nextValue: string) => {
      onChange?.({
        target: { value: nextValue },
      } as React.ChangeEvent<HTMLSelectElement>);
      setOpen(false);
    };

    return (
      <div ref={containerRef} className="relative">
        <select
          {...props}
          ref={ref}
          value={stringValue}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        >
          {children}
        </select>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-950 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus-visible:ring-zinc-100/15",
            !selectedOption?.value && "text-zinc-500 dark:text-zinc-400",
            className,
          )}
        >
          <span className="truncate">{selectedOption?.label || "Pilih opsi"}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-zinc-400 transition-transform dark:text-zinc-300",
              open && "rotate-180",
            )}
          />
        </button>

        {open ? (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-300" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari..."
                className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-100/15"
              />
            </div>

            <div className="mt-2 max-h-60 overflow-y-auto">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === stringValue;

                  return (
                    <button
                      key={`${option.value}-${option.label}`}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800",
                        isSelected && "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-100",
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <Check className="ml-3 h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">Tidak ada hasil.</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
