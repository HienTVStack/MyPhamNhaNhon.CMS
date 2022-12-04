import { Fragment, useEffect, useRef, useState } from "react";
import {
    Box,
    Breadcrumbs,
    Stack,
    Typography,
    Link,
    Grid,
    Paper,
    TextField,
    FormControlLabel,
    Switch,
    Button,
    FormControl,
    Autocomplete,
    Checkbox,
    FormLabel,
    ImageList,
    ImageListItem,
    Snackbar,
    Alert,
    IconButton,
    Modal,
    Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
// import { v4 as uuidv4 } from "uuid";
import productApi from "src/api/productApi";
import tagApi from "src/api/tagApi";
import imageApi from "src/api/imageApi";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "src/components/Loading";
import Iconify from "src/components/Iconify";

const preUrls = [
    {
        preUrl: "/",
        title: "Dashboard",
    },
    {
        preUrl: "/products",
        title: "Sản phẩm",
    },
    {
        preUrl: "#",
        title: "Chỉnh sửa",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    maxWidth: "100%",
    height: "600px",
    backgroundColor: "#fff",
    boxShadow: 2,
    p: 4,
    overflowY: "scroll",
    borderRadius: "20px",
};

const styleChecked = {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    border: "none",
};

function ProductEdit() {
    const descriptionRef = useRef();
    const detailRef = useRef();
    const navigate = useNavigate();
    const categoryList = useSelector((state) => state.data.categoryList);
    const tagList = useSelector((state) => state.data.tagList);

    const [loading, setLoading] = useState(false);
    const [tabValue, setTableValue] = useState("1");
    const [isShowModal, setIsShowModal] = useState(false);
    const [tagAdd, setTagAdd] = useState("");

    // data
    const [productName, setProductName] = useState("");
    const [descriptionContent, setDescriptionContent] = useState("");
    const [detailContent, setDetailContent] = useState("");
    // const [productPrice, setProductPrice] = useState(0);
    const [categorySelected, setCategorySelected] = useState([]);
    const [tagSelected, setTagSelected] = useState([]);
    const [tagAddErr, setTagAddErr] = useState("");
    const [imageList, setImageList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([{ url: "", id: "" }]);
    const [isUpload, setIsUpload] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState([]);
    const [discountValue, setDiscountValue] = useState(0);
    const [inStock, setInStock] = useState(false);
    // err
    const [detailContentErr, setDetailContentErr] = useState("");
    const [descriptionContentErr, setDescriptionContentErr] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [discountValueErr, setDiscountValueErr] = useState("");
    const [priceErr, setPriceErr] = useState("");
    const [categoryErr, setCategoryErr] = useState("");
    const [textNotify, setTextNotify] = useState({});
    const [inputTypeList, setInputTypeList] = useState([{ nameType: "", price: 0, salePrice: 0 }]);

    const { slug } = useParams();

    const loadProductFirst = async () => {
        const res = await productApi.getAll();

        if (res.message === "OK") {
            navigate(`/dashboard/products/${res.products[0].slug}/edit`);
        }
    };

    const handleProductLoader = async () => {
        setLoading(true);
        try {
            const res = await productApi.getProductBySlug(slug);

            if (res.message === "OK") {
                const productItem = res.product;

                setProductName(productItem.name);
                setDescriptionContent(productItem.descriptionContent);
                setDetailContent(productItem.detailContent);
                setInStock(productItem.inStock);
                setCategorySelected(productItem.category);
                setTagSelected(productItem.tags);
                setSelectedImages(productItem.imageList);
                setInputTypeList(productItem.type);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleImageLoader = async () => {
        try {
            const res = await imageApi.getAll();
            if (res.message === "OK") {
                setImageList(res.images);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (slug === ":slug") {
            loadProductFirst();
        }
        handleProductLoader();
        handleImageLoader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // Handle change action tab
    const handleChangeTabModal = (e, newValue) => {
        setTableValue(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNameErr("");
        setDiscountValue("");
        setDescriptionContentErr("");
        setPriceErr("");
        setCategoryErr("");
        const data = new FormData(e.target);

        const name = data.get("name");
        // const inStock = data.get("inStock");
        const discountValue = data.get("code");
        const price = data.get("price");

        let err = false;
        if (name === "") {
            err = true;
            setNameErr(`Hãy nhập tên sản phẩm`);
        }

        if (price === "") {
            err = true;
            setPriceErr(`Nhập giá của sản phẩm`);
        }

        if (price !== "" && Number(price) <= 0) {
            err = true;
            setPriceErr(`Giá của sản phẩm phải lớn hơn 0`);
        }

        if (descriptionContent === "") {
            err = true;
            setDescriptionContentErr("Nhập mô tả cho sản phẩm");
        }

        if (detailContent === "") {
            err = true;
            setDetailContentErr("Nhập mô tả chi tiết cho sản phẩm");
        }

        if (categorySelected === "") {
            err = true;
            setCategoryErr(`Chọn loại cho sản phẩm`);
        }

        setLoading(false);

        if (err) return;

        setLoading(true);

        const product = {
            name: productName,
            descriptionContent: descriptionContent,
            detailContent: detailContent,
            inStock: inStock,
            discountValue: discountValue,
            imageList: selectedImages,
            category: categorySelected,
            tags: tagSelected,
            slug: slug,
            type: inputTypeList.sort((a, b) => a.price - b.price),
        };

        try {
            const res = await productApi.update(product, slug);
            if (res) {
                navigate("/dashboard/products/list");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleCreateTag = async () => {
        setLoading(true);
        setTagAddErr("");
        try {
            if (tagAdd === "") {
                setLoading(false);
                return;
            }
            const res = await tagApi.create({ name: tagAdd });

            if (res.message !== "FAIL") {
                tagList.push(res.tag);
                tagSelected.push(res.tag);
                setTagAdd("");
            }
            setLoading(false);
        } catch (error) {
            setTagAddErr(`Thẻ này đã tồn tại`);
            setLoading(false);
        }
    };

    const handleChangeTagAdd = (e) => {
        const format = /^[0-9a-zA-Z''-]{0,40}$/;

        const value = e.target.value;

        if (format.test(value)) {
            setTagAddErr("");
            setTagAdd(value);
            return true;
        } else {
            console.log(false);
            setTagAddErr("Không được nhập kí tự đặc biệt");
            return false;
        }
    };

    const handleRemoveImage = (url) => {
        setSelectedImages(selectedImages.filter((item) => item !== url));
    };

    const handleImageRemoveAll = async () => {
        setSelectedImages([]);
        setLoading(true);
        try {
            const res = await productApi.updateImage({ slug, imageList: [] });

            if (res.message === "OK") {
                setSelectedImages(res.product.imageList);
                setImageUploadUrl([]);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectImageModal = (checked, index, imageUrl) => {
        if (checked) {
            imageUploadUrl.push({ key: index, imageUrl });
        } else {
            const newArray = imageUploadUrl.filter((img) => img.key !== index);
            setImageUploadUrl(newArray);
        }
    };

    const handleInsertImage = async () => {
        imageUploadUrl.map((img) => selectedImages.push(img.imageUrl));
        setLoading(true);
        try {
            const res = await productApi.updateImage({
                slug,
                imageList: selectedImages,
            });
            if (res.message === "OK") {
                setTextNotify({ text: "Cập nhật ảnh thành công" });
                const imageListRequest = [];
                for (let i = 0; i < res.product.imageList.length; i++) {
                    imageListRequest.push(res.product.imageList[i]);
                }
                setSelectedImages(imageListRequest);
                setImageUploadUrl([]);
            }
        } catch (error) {
            console.log(error);
        }
        setIsShowModal(false);
        setLoading(false);
    };

    const handleSelectImage = async (e) => {
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        setLoading(true);
        const data = new FormData();

        for (const file of selectedFilesArray) {
            data.append("file", file);
            data.append("upload_preset", "iwn62ygb");

            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/diitw1fjj/image/upload", data);
                if (res.statusText === "OK") {
                    const addImage = await imageApi.create({
                        fileUrl: res.data.secure_url,
                    });

                    if (addImage.message === "OK") {
                        handleImageLoader();
                        setTableValue("2");
                        selectedImages.push(String(res.data.secure_url));
                    }
                }

                setIsUpload(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setIsUpload(true);
                setTextNotify({
                    backgroundColor: "error",
                    text: "Failed! Tải ảnh thất bại",
                });
            }
        }
        setLoading(false);
    };

    const handleInputTypeProductChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputTypeList];
        list[index][name] = value;
        setInputTypeList(list);
    };
    const handleAddInputTypeClick = (e, index) => {
        setInputTypeList([...inputTypeList, { nameType: "", price: "" }]);
    };

    const handleRemoveInputType = (index) => {
        const list = [...inputTypeList];
        list.splice(index, 1);
        setInputTypeList(list);
    };

    return (
        <Fragment>
            <Box>
                <Typography variant="h3" component="h3">
                    Chỉnh sửa sản phẩm
                </Typography>
                <Stack spacing={2}>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
            </Box>
            {/* Content */}

            <Stack mt={3}>
                <Grid container spacing={3} component={"form"} noValidate onSubmit={handleSubmit}>
                    <Grid item xs={12} md={7} lg={7}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4} mb={4}>
                                <TextField
                                    placeholder="Tên sản phẩm"
                                    label="Tên sản phẩm"
                                    name={"name"}
                                    id={"name"}
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    helperText={nameErr}
                                    error={nameErr !== ""}
                                />
                                <FormControl sx={{ margin: "16px 0" }} fullWidth>
                                    <FormLabel>Mô tả ngắn*</FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        value={descriptionContent}
                                        onInit={(e, editor) => (descriptionRef.current = editor)}
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            max_height: 200,
                                            plugins: "link image code",
                                        }}
                                        onChange={(e) => setDescriptionContent(descriptionRef.current.getContent())}
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontSize={"0.75rem"}
                                            sx={{
                                                margin: "3px 14px 0 14px",
                                            }}
                                        >
                                            {descriptionContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl sx={{ margin: "16px 0" }} fullWidth>
                                    <FormLabel>Mô tả chi tiết sản phẩm*</FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        value={detailContent}
                                        onInit={(e, editor) => (detailRef.current = editor)}
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            plugins: "link image code",
                                            toolbar:
                                                "undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code",
                                        }}
                                        onChange={(e) => setDetailContent(detailRef.current.getContent())}
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontSize={"0.75rem"}
                                            sx={{
                                                margin: "3px 14px 0 14px",
                                            }}
                                        >
                                            {detailContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl fullWidth>
                                    <FormLabel htmlFor="images">+ Add image</FormLabel>
                                    <ImageList cols={5}>
                                        {selectedImages.map((image, index) => (
                                            <Box key={index}>
                                                <ImageListItem
                                                    sx={{
                                                        margin: "12px",
                                                    }}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={""}
                                                        style={{
                                                            height: "100px",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                    <Button onClick={() => handleRemoveImage(image)}>Xóa bỏ</Button>
                                                </ImageListItem>
                                            </Box>
                                        ))}
                                    </ImageList>
                                    <Box display={"flex"} justifyContent="end" mt={4}>
                                        <Button variant="outlined" onClick={handleImageRemoveAll}>
                                            Xóa tất cả
                                        </Button>
                                        <Button variant="contained" sx={{ marginLeft: "16px" }} onClick={() => setIsShowModal(true)}>
                                            Tải thêm ảnh
                                        </Button>
                                    </Box>
                                </FormControl>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4}>
                                <FormControlLabel
                                    control={<Switch value={inStock} onChange={(e) => setInStock(e.target.checked)} />}
                                    label="Hiển thị"
                                    name="inStock"
                                    id={"inStock"}
                                />
                                <TextField
                                    placeholder="Giảm giá %"
                                    label="Giảm giá %"
                                    name={"discountValue"}
                                    id={"discountValue"}
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    required
                                    fullWidth
                                    margin="normal"
                                    disabled={loading}
                                    helperText={discountValueErr}
                                    error={discountValueErr !== ""}
                                />

                                <Paper sx={{ backgroundColor: "rgb(244, 246, 248)", padding: "20px" }}>
                                    <Typography>Loại sản phẩm</Typography>
                                    {inputTypeList.map((x, i) => {
                                        return (
                                            <Stack sx={{ margin: "20px 0" }} alignItems="end" key={i}>
                                                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                                    <TextField
                                                        placeholder="Thể loại"
                                                        label="Thể loại"
                                                        name={"nameType"}
                                                        id={"nameType"}
                                                        required
                                                        fullWidth
                                                        disabled={loading}
                                                        error={priceErr !== ""}
                                                        helperText={priceErr}
                                                        sx={{ flex: 2 }}
                                                        value={x.nameType}
                                                        onChange={(e) => handleInputTypeProductChange(e, i)}
                                                    />
                                                    <TextField
                                                        placeholder="Giá nhập"
                                                        label="Giá nhập"
                                                        name={"price"}
                                                        id={"price"}
                                                        required
                                                        fullWidth
                                                        disabled={loading}
                                                        error={priceErr !== ""}
                                                        helperText={priceErr}
                                                        sx={{ flex: 1 }}
                                                        value={x.price}
                                                        onChange={(e) => handleInputTypeProductChange(e, i)}
                                                    />
                                                    <TextField
                                                        placeholder="Giá bán"
                                                        label="Giá bán"
                                                        name={"salePrice"}
                                                        id={"salePrice"}
                                                        required
                                                        fullWidth
                                                        disabled={loading}
                                                        error={priceErr !== ""}
                                                        helperText={priceErr}
                                                        sx={{ flex: 1 }}
                                                        value={x.salePrice}
                                                        onChange={(e) => handleInputTypeProductChange(e, i)}
                                                    />
                                                </Stack>
                                                {inputTypeList.length !== 1 && (
                                                    <Button
                                                        variant="text"
                                                        color="error"
                                                        startIcon={<Iconify icon="bi:trash-fill" />}
                                                        onClick={() => handleRemoveInputType(i)}
                                                        sx={{ width: "40%", marginTop: "8px" }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Stack>
                                        );
                                    })}

                                    <Button variant="text" startIcon={<Iconify icon="carbon:add" />} onClick={handleAddInputTypeClick}>
                                        Add item
                                    </Button>
                                </Paper>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    value={categorySelected}
                                    options={categoryList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    onChange={(e, value) => setCategorySelected(value)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<Icon icon="bx:checkbox" />}
                                                checkedIcon={<Icon icon="bx:checkbox-checked" />}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => <TextField {...params} margin="normal" label="Danh mục sản phẩm" />}
                                />

                                <Autocomplete
                                    fullWidth
                                    multiple
                                    value={tagSelected}
                                    options={tagList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    onChange={(e, value) => setTagSelected(value)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<Icon icon="bx:checkbox" />}
                                                checkedIcon={<Icon icon="bx:checkbox-checked" />}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => <TextField {...params} margin="normal" label="Tags" />}
                                />

                                <Typography variant="body2" component={"h4"} color={"primary"} fontSize={"16px"} mt={2}>
                                    Thêm mới thẻ tag
                                </Typography>
                                <Box noValidate display={"flex"} alignItems="center">
                                    <TextField
                                        label="Tags"
                                        name="tag"
                                        id="tag"
                                        margin="normal"
                                        helperText={tagAddErr}
                                        error={tagAddErr !== ""}
                                        value={tagAdd}
                                        fullWidth
                                        onChange={handleChangeTagAdd}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={handleCreateTag}
                                        sx={{
                                            margin: "12px 0",
                                            border: "1px solid primary",
                                        }}
                                    >
                                        <Icon icon="carbon:add" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>

                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{
                                width: "100%",
                                marginTop: "20px",
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Grid>
                </Grid>
            </Stack>

            <Snackbar
                open={isUpload}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                autoHideDuration={3000}
                onClose={() => setIsUpload(false)}
            >
                <Alert sx={{ backgroundColor: textNotify.backgroundColor }}>{textNotify.text}</Alert>
            </Snackbar>
            <Modal open={isShowModal} disableAutoFocus disableEnforceFocus onClose={() => setIsShowModal(false)}>
                <Box sx={{ ...style }}>
                    <Typography variant="body2" component="h2" fontSize={"30px"} fontWeight={700}>
                        Insert Media
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                        <TabContext value={tabValue}>
                            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                <TabList onChange={handleChangeTabModal} aria-label="lab API tabs example">
                                    <Tab label="Tải ảnh lên" value="1" />
                                    <Tab label="Thư viện ảnh" value="2" />
                                    <Tab label="Item Three" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                    <Typography variant="h3" fontSize={"20px"}>
                                        Thả tệp để tải lên
                                    </Typography>
                                    <Typography fontSize={"14px"} color={"#ccc"}>
                                        hoặc
                                    </Typography>
                                    <Box component="label" mt={2}>
                                        <input hidden multiple type="file" accept="image/*" onChange={handleSelectImage} />
                                        <Button variant="outlined" component={"p"} size="large">
                                            Chọn tệp
                                        </Button>
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel value="2">
                                <Grid container>
                                    <Grid item sm={12} md={12} lg={9} xs={9}>
                                        <ImageList cols={5}>
                                            {selectedImages.map((image, index) => (
                                                <Box key={index}>
                                                    <ImageListItem
                                                        sx={{
                                                            position: "relative",
                                                            margin: "12px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "12px",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            defaultChecked
                                                            disabled
                                                            id={`checkboxImageSelect${index}`}
                                                            sx={{
                                                                ...styleChecked,
                                                            }}
                                                        />
                                                        <label htmlFor={`checkboxImageSelect${index}`}>
                                                            <img
                                                                src={image}
                                                                alt={""}
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        </label>
                                                    </ImageListItem>
                                                </Box>
                                            ))}
                                            {!!imageList &&
                                                imageList.map((image, index) => (
                                                    <Box key={index}>
                                                        <ImageListItem
                                                            sx={{
                                                                position: "relative",
                                                                margin: "12px",
                                                                border: "1px solid #ccc",
                                                                borderRadius: "12px",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    handleSelectImageModal(checked, index, image.fileUrl);
                                                                }}
                                                                id={`checkboxImage${index}`}
                                                                sx={{
                                                                    ...styleChecked,
                                                                }}
                                                            />
                                                            <label htmlFor={`checkboxImage${index}`}>
                                                                <img
                                                                    src={image.fileUrl}
                                                                    alt={image.caption}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                />
                                                            </label>
                                                        </ImageListItem>
                                                    </Box>
                                                ))}
                                        </ImageList>
                                    </Grid>
                                    <Grid item sm={12} md={12} lg={3} xs={3}>
                                        <Button onClick={handleInsertImage}>Insert Media</Button>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value="3">Item Three</TabPanel>
                        </TabContext>
                    </Box>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default ProductEdit;
