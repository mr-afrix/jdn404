import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0, gcTime: 0, retry: 2, refetchOnWindowFocus: true } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Index />
  </QueryClientProvider>
);

export default App;
