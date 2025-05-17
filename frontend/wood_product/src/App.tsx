// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { CartProvider } from "./context/CartContext";
// import AppRouter from "./router";
// import Layout from "./components/layout/Layout";

// const App: React.FC = () => {
//   return (
//     <React.StrictMode>
//       <BrowserRouter>
//         <AuthProvider>
//           <CartProvider>
//             <Layout>
//               <AppRouter />
//             </Layout>
//           </CartProvider>
//         </AuthProvider>
//       </BrowserRouter>
//     </React.StrictMode>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
