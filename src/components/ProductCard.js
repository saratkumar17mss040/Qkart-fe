import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img" alt={product.name} src={product.image} />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography paddingY="0.5rem" fontWeight="700">
          ${product.cost}
        </Typography>
        <Rating
          name="readOnly"
          defaultValue={product.rating}
          precision={0.5}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button
          className="card-button"
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
