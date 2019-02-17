DROP FUNCTION get_products(character varying);
CREATE FUNCTION get_products(v_product_name CHARACTER VARYING(255))
RETURNS TABLE(id INTEGER, title CHARACTER VARYING(255), price NUMERIC, tags CHARACTER VARYING(255)[])
AS $$
BEGIN
    IF $1 = '' THEN
        RETURN QUERY
            SELECT products.id, products.title, products.price, products.tags FROM products;
    ELSE
        RETURN QUERY
            SELECT products.id, products.title, products.price, products.tags FROM products WHERE products.title = $1;
    END IF;
END;
$$ LANGUAGE plpgsql;
