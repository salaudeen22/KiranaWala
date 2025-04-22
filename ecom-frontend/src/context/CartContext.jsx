import React, { createContext, useContext, useReducer } from "react";
import Swal from "sweetalert2";

const CartContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  console.log("Dispatched action:", action);
  switch (action.type) {
    case "ADD": {
      const { id, name, price, qty = 1, img } = action;
      if (!id) {
        console.error("Invalid action for ADD:", action);
        return state;
      }
      const existingItem = state.find(item => item.id === id);
      if (existingItem) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "fire",
          title: `${name} quantity updated in the cart.`,
          showConfirmButton: false,
          timer: 1500,
        });
        return state.map(item =>
          item.id === id
            ? { 
                ...item, 
                qty: item.qty + qty, 
                price: item.price + price 
              }
            : item
        );
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${name} added to the cart.`,
        showConfirmButton: false,
        timer: 1500,
      });
      return [
        ...state, 
        {
          id,
          name,
          price,
          qty,
          img
        }
      ];
    }
      
    case "REMOVE":
      return state.filter(item => item.id !== action.id);

    case "UPDATE":
      return state.map(item => 
        item.id === action.id
          ? { ...item, qty: action.qty, price: action.price }
          : item
      );

    case "DROP":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartContext.Provider value={state}>{children}</CartContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export const useDispatchCart = () => useContext(CartDispatchContext);