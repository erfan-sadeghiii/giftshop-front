import { useAuth } from '@/context/AuthContext';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// --------- Adapter -------------
const productsAdapter = createEntityAdapter();

// Selectors
export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds,
} = productsAdapter.getSelectors(state => state.cart);

// --------- Async Thunk -------------
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (accessToken) => {
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/cart/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
);



// Increase or decrease item quantity
export const updateCartQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ itemId, newQuantity, accessToken }) => {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/shop/cart-items/${itemId}/`,
            { quantity: newQuantity },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data; // should return updated item
    }
);


// Delete item
export const removeProductFromCart = createAsyncThunk(
    "cart/removeProduct",
    async ({ itemId, accessToken }) => {
        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/shop/cart-items/${itemId}/`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return itemId; // return the deleted item's ID
    }
);



export const addProductToCart = createAsyncThunk(
  "cart/addProduct",
  async ({ productId, quantity = 1, accessToken }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/shop/cart-items/`,
      { product_id: productId, quantity }, // ✅ matches serializer
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
);

// --------- Initial State -------------
const initialState = productsAdapter.getInitialState({
    status: 'idle',
    error: null,
});

// --------- Slice -------------
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        quantityIncreased: (state, action) => {
            const id = action.payload;
            if (state.entities[id]) {
                state.entities[id].quantity += 1;
            }
        },
        quantityDecreased: (state, action) => {
            const id = action.payload;
            if (state.entities[id] && state.entities[id].quantity > 0) {
                state.entities[id].quantity -= 1;
            }
        },
        productRemovedOptimistic: productsAdapter.removeOne,
        productAddedOptimistic: productsAdapter.addOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                productsAdapter.upsertMany(state, action.payload.items);
                state.status = 'success';
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                productsAdapter.updateOne(state, {
                    id: updatedItem.id,
                    changes: { quantity: updatedItem.quantity },
                });
            })
            .addCase(removeProductFromCart.fulfilled, (state, action) => {
                productsAdapter.removeOne(state, action.payload);
            })
            .addCase(addProductToCart.fulfilled, (state, action) => {
                productsAdapter.addOne(state, action.payload);
            });


    }
});

export const {
    quantityDecreased,
    quantityIncreased,
    productRemovedOptimistic,
    productAddedOptimistic
} = cartSlice.actions;

export default cartSlice.reducer;

// Selector for entities
export const selectCartEntities = state => state.cart.entities;
