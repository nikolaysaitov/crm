import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CallTable from "../features/callTable/ui/CallTable";
import "./App.css";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <CallTable />
      </div>
      
    </QueryClientProvider>
  );
}

export default App;
