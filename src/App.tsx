import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 2 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Index />
  </QueryClientProvider>
);

export default App;
