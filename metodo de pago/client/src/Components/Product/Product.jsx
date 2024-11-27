import { useState } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";
import img from "../../assets/monstera_f97f4746_800x800.jpg"
import "./Product.css";

export const Product = () => {

  const [preferenceId, setPreferenceID] = useState(null);

  initMercadoPago('APP_USR-0d87c446-9881-4c1d-a5d5-4dcd956613d9', {
    locale: 'es-CO',
    advancedFraudPrevention: true,
    debug: true,
  });

  const createPreference = async () => {
    try {
      const response = await axios.post("http://localhost:8080/create_preference", {
        title: "Monstera",
        quantity: 1,
        price: 1000,
      });

      console.log("Respuesta del backend:", response.data);  // Añadir un log para verificar la respuesta
    

      const { id } = response.data;
      if (!id) {
        throw new Error("No se recibió un 'id' válido para la preferencia");
      }
      return id;
    } catch (error) {
      console.log("Error al crear la preferencia:", error);
      return null;
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceID(id);
    }else {
      console.error("No se pudo obtener el ID de la preferencia.");
    }
  };

  return (

    <div className="card-product-container">
      <div className="card-product">
        <div className="card">
          <img src={img} alt="Product Imagen" />
          <h3> Monstera</h3>
          <p className="price">$1000</p>
          <button  onClick={handleBuy}> Comprar </button>
          {preferenceId && (
            <Wallet
              initialization={{ preferenceId }}
              customization={{
                // Configuración para evitar errores en campos
                paymentMethods: {
                  ticket: false,
                  atm: false,
                },
              }}
            />
          )}
          
        </div>
      </div>
    </div>

  );

};

export default Product;
