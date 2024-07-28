// import { useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error;
//   reset: () => void;
// }) {
//   const { toast } = useToast();

//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error Occurred",
//         description: error.message,
//       });
//     }
//   }, [error, toast]);

//   return (
//     <div>
//       <h1>An error occurred</h1>
//       <button onClick={reset}>Try again</button>
//     </div>
//   );
// }
