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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
    Checkbox,
    Backdrop,
    CircularProgress,
    FormLabel,
    ImageList,
    ImageListItem,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categoryApi from "src/api/categoryApi";
import productApi from "src/api/productApi";
import tagApi from "src/api/tagApi";

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
        preUrl: "/create",
        title: "Tạo mới sản phẩm",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

function CreateProduct() {
    const descriptionRef = useRef();
    const detailRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // data
    const [descriptionContent, setDescriptionContent] = useState("");
    const [detailContent, setDetailContent] = useState("");
    const [categorySelected, setCategorySelected] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagAdd, setTagAdd] = useState("");
    const [tagAddErr, setTagAddErr] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadImages, setUploadImages] = useState([]);
    const [isUpload, setIsUpload] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState([]);
    // err
    const [detailContentErr, setDetailContentErr] = useState("");
    const [descriptionContentErr, setDescriptionContentErr] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [codeErr, setCodeErr] = useState("");
    const [priceErr, setPriceErr] = useState("");
    const [categoryErr, setCategoryErr] = useState("");
    const [textNotify, setTextNotify] = useState({});

    useEffect(() => {
        const handleLoaderFirst = async () => {
            try {
                const getAllCategories = await categoryApi.getAll();
                const getAllTags = await tagApi.getAll();

                if (getAllCategories.message !== "FAIL") {
                    setCategoryList(getAllCategories.categories);
                }

                if (getAllTags.message !== "FAIL") {
                    setTagList(getAllTags.tags);
                }
            } catch (error) {
                alert(error);
                console.log(error);
            }
        };
        handleLoaderFirst();
    }, [navigate]);
    //  Handle show image UI
    const handleSelectImage = (e) => {
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        const arrayRequest = uploadImages;

        // Convert list file upload
        const arrConvert = [];
        selectedFilesArray.forEach((file) => {
            arrConvert.push({ key: Math.random(), file });
        });
        arrayRequest.push(...arrConvert);

        setUploadImages(arrayRequest);

        const imageArray = arrayRequest.map((img) => {
            return { key: img.key, url: URL.createObjectURL(img.file) };
        });

        setSelectedImages(imageArray);

        setIsUpload(false);
    };
    // Handle upload image
    const handleUploadImage = async (e) => {
        setLoading(true);
        const imageUrl = [];
        const data = new FormData();

        for (const file of uploadImages) {
            data.append("file", file.file);
            data.append("upload_preset", "iwn62ygb");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/diitw1fjj/image/upload",
                    data
                );
                imageUrl.push(res.data.secure_url);
                setTextNotify({
                    backgroundColor: "#28A745",
                    text: "Successfully!!! Tải ảnh thành công",
                });
                setIsUpload(true);
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
        setImageUploadUrl(imageUrl);
        setLoading(false);
        setIsUpload(true);
    };

    const handleRemoveImageUpload = (image) => {
        setSelectedImages(selectedImages.filter((e) => e.key !== image.key));
        setUploadImages(uploadImages.filter((e) => e.key !== image.key));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNameErr("");
        setCodeErr("");
        setDescriptionContentErr("");
        setPriceErr("");
        setCategoryErr("");
        setLoading(true);
        const data = new FormData(e.target);

        const name = data.get("name");
        const inStock = data.get("inStock");
        const code = data.get("code");
        const price = data.get("price");

        let err = false;
        if (name === "") {
            err = true;
            setNameErr(`Hãy nhập tên sản phẩm`);
        }
        if (code === "") {
            err = true;
            setCodeErr(`Hãy nhập mã sản phẩm`);
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
        console.log(imageUploadUrl);
        if (imageUploadUrl.length <= 0) {
            err = true;
            setIsUpload(true);
            setTextNotify({
                backgroundColor: "#FFC107",
                text: "Warning! Chú ý bạn chưa tải ảnh lên could",
            });
        }

        setLoading(false);

        if (err) return;

        setLoading(true);

        try {
            const res = await productApi.create({
                name,
                descriptionContent,
                detailContent,
                inStock,
                categorySelected,
                tags,
                imageUploadUrl,
                price,
            });
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
                tags.push(res.tag);
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

    return (
        <Fragment>
            <Box>
                <Typography variant="h3" component="h3">
                    Tạo mới sản phẩm
                </Typography>
                <Stack spacing={2}>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
            </Box>
            {/* Content */}
            <Stack mt={3}>
                <Grid
                    container
                    spacing={3}
                    component={"form"}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4} mb={4}>
                                <TextField
                                    placeholder="Tên sản phẩm"
                                    label="Tên sản phẩm"
                                    name={"name"}
                                    id={"name"}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    helperText={nameErr}
                                    error={nameErr !== ""}
                                />
                                <FormControl
                                    sx={{ margin: "16px 0" }}
                                    fullWidth
                                >
                                    <FormLabel>Mô tả ngắn*</FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        onInit={(e, editor) =>
                                            (descriptionRef.current = editor)
                                        }
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            max_height: 200,
                                            plugins: "link image code",
                                        }}
                                        onChange={(e) =>
                                            setDescriptionContent(
                                                descriptionRef.current.getContent()
                                            )
                                        }
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontSize={"0.75rem"}
                                            sx={{ margin: "3px 14px 0 14px" }}
                                        >
                                            {descriptionContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl
                                    sx={{ margin: "16px 0" }}
                                    fullWidth
                                >
                                    <FormLabel>
                                        Mô tả chi tiết sản phẩm*
                                    </FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        onInit={(e, editor) =>
                                            (detailRef.current = editor)
                                        }
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            plugins: "link image code",
                                            toolbar:
                                                "undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code",
                                        }}
                                        onChange={(e) =>
                                            setDetailContent(
                                                detailRef.current.getContent()
                                            )
                                        }
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontSize={"0.75rem"}
                                            sx={{ margin: "3px 14px 0 14px" }}
                                        >
                                            {detailContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl fullWidth>
                                    <FormLabel htmlFor="images">
                                        + Add image
                                    </FormLabel>
                                    <Box
                                        fullWidth
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            multiple
                                            onChange={handleSelectImage}
                                        />
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent={"center"}
                                            sx={{
                                                height: "100%",
                                                backgroundColor:
                                                    "rgb(244, 246, 248)",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    fontSize: "70px",
                                                    color: "#F0BD71",
                                                    margin: "0 30px",
                                                }}
                                            >
                                                <Icon icon="akar-icons:cloud-upload" />
                                            </Box>
                                            <Stack sx={{ margin: "0 20px" }}>
                                                <Typography
                                                    variant="body2"
                                                    color="primary"
                                                    fontSize="20px"
                                                    component={"h5"}
                                                    gutterBottom
                                                >
                                                    Kéo hoặc chọn tệp
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="primary"
                                                    fontSize="14px"
                                                >
                                                    Thả tệp vào đây hoặc nhấp
                                                    vào browser máy của bạn
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Box>
                                    <ImageList cols={5}>
                                        {!!selectedImages &&
                                            selectedImages.map((image) => (
                                                <Box key={image.key}>
                                                    <ImageListItem
                                                        sx={{
                                                            margin: "12px",
                                                        }}
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt={image}
                                                            style={{
                                                                height: "100px",
                                                                objectFit:
                                                                    "contain",
                                                            }}
                                                        />
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveImageUpload(
                                                                    image
                                                                )
                                                            }
                                                        >
                                                            Xóa bỏ
                                                        </Button>
                                                    </ImageListItem>
                                                </Box>
                                            ))}
                                    </ImageList>
                                    {selectedImages.length > 0 && (
                                        <Box
                                            display={"flex"}
                                            justifyContent="end"
                                            mt={4}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    setSelectedImages([])
                                                }
                                            >
                                                Xóa tất cả
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{ marginLeft: "16px" }}
                                                onClick={handleUploadImage}
                                            >
                                                Upload image
                                            </Button>
                                        </Box>
                                    )}
                                </FormControl>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4}>
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Hiển thị"
                                    name="inStock"
                                    id={"inStock"}
                                />
                                <TextField
                                    placeholder="Code"
                                    label="Code"
                                    name={"code"}
                                    id={"code"}
                                    required
                                    fullWidth
                                    margin="normal"
                                    disabled={loading}
                                    helperText={codeErr}
                                    error={codeErr !== ""}
                                />
                                <TextField
                                    placeholder="Giá sản phẩm"
                                    label="Giá sản phẩm"
                                    name={"price"}
                                    id={"price"}
                                    required
                                    fullWidth
                                    margin="normal"
                                    disabled={loading}
                                    error={priceErr !== ""}
                                    helperText={priceErr}
                                />
                                <FormControl
                                    fullWidth
                                    sx={{ margin: "16px 0" }}
                                >
                                    <InputLabel>Loại sản phẩm</InputLabel>
                                    <Select
                                        value={categorySelected}
                                        label="Loại sản phẩm"
                                        fullWidth
                                        error={categoryErr !== ""}
                                        onChange={(e, value) =>
                                            setCategorySelected(e.target.value)
                                        }
                                    >
                                        {categoryList.map((category) => (
                                            <MenuItem
                                                value={category._id}
                                                key={category._id}
                                            >
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {!!categoryErr && (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontSize={"0.75rem"}
                                            sx={{ margin: "3px 14px 0 14px" }}
                                        >
                                            {categoryErr}
                                        </Typography>
                                    )}
                                </FormControl>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="checkboxes-tags"
                                    options={tagList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.name}
                                    onChange={(e, value) => setTags(value)}
                                    renderOption={(
                                        props,
                                        option,
                                        { selected }
                                    ) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={
                                                    <Icon icon="bx:checkbox" />
                                                }
                                                checkedIcon={
                                                    <Icon icon="bx:checkbox-checked" />
                                                }
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Tags" />
                                    )}
                                />
                                <Typography
                                    variant="body2"
                                    component={"h4"}
                                    color={"primary"}
                                    fontSize={"16px"}
                                    mt={2}
                                >
                                    Thêm mới thẻ tag
                                </Typography>
                                <Box
                                    noValidate
                                    display={"flex"}
                                    alignItems="center"
                                >
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
                            Tạo mới sản phẩm
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            {/* Backdrop */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
                onClick={() => setLoading(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Snackbar */}
            <Snackbar
                open={isUpload}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                autoHideDuration={3000}
                onClose={() => setIsUpload(false)}
            >
                <Alert sx={{ backgroundColor: textNotify.backgroundColor }}>
                    {textNotify.text}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default CreateProduct;
