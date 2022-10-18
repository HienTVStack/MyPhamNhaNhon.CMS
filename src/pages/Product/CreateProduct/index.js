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
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categoryApi from "src/api/categoryApi";

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

const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    {
        title: "The Lord of the Rings: The Return of the King",
        year: 2003,
    },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
    },
    {
        title: "Star Wars: Episode V - The Empire Strikes Back",
        year: 1980,
    },
    { title: "Forrest Gump", year: 1994 },
    { title: "Inception", year: 2010 },
    {
        title: "The Lord of the Rings: The Two Towers",
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: "Goodfellas", year: 1990 },
    { title: "The Matrix", year: 1999 },
    { title: "Seven Samurai", year: 1954 },
    {
        title: "Star Wars: Episode IV - A New Hope",
        year: 1977,
    },
    { title: "City of God", year: 2002 },
    { title: "Se7en", year: 1995 },
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: "Life Is Beautiful", year: 1997 },
    { title: "The Usual Suspects", year: 1995 },
    { title: "Léon: The Professional", year: 1994 },
    { title: "Spirited Away", year: 2001 },
    { title: "Saving Private Ryan", year: 1998 },
    { title: "Once Upon a Time in the West", year: 1968 },
    { title: "American History X", year: 1998 },
    { title: "Interstellar", year: 2014 },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

function CreateProduct() {
    const editorRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // data
    const [descriptionContent, setDescriptionContent] = useState("");
    const [detailContent, setDetailContent] = useState("");
    const [categorySelected, setCategorySelected] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadImages, setUploadImages] = useState([]);
    const [isUpload, setIsUpload] = useState(false);
    // err
    const [detailContentErr, setDetailContentErr] = useState("");
    const [descriptionContentErr, setDescriptionContentErr] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [codeErr, setCodeErr] = useState("");
    const [priceErr, setPriceErr] = useState("");
    const [categoryErr, setCategoryErr] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await categoryApi.getAll();

                console.log(res);
            } catch (error) {
                console.log(error);
            }
        };
        getCategories();
    }, [navigate]);
    //  Handle show image UI
    const handleSelectImage = (e) => {
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        const arrayCurrent = uploadImages;
        arrayCurrent.push(...selectedFilesArray);

        setUploadImages(arrayCurrent);

        const imageArray = arrayCurrent.map((img, index) => {
            return { name: img.name, url: URL.createObjectURL(img) };
        });

        setSelectedImages(imageArray);

        setIsUpload(false);
    };
    // Handle upload image
    const handleUploadImage = async (e) => {
        setLoading(true);

        const data = new FormData();

        for (const file of uploadImages) {
            data.append("file", file);
            data.append("upload_preset", "iwn62ygb");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/diitw1fjj/image/upload",
                    data
                );
                console.log(res);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        setLoading(false);
        setIsUpload(true);
    };

    console.log(uploadImages);

    const handleRemoveImageUpload = (image) => {
        setSelectedImages(selectedImages.filter((e) => e.name !== image.name));
        for (const item of uploadImages) {
            const tmp = URL.createObjectURL(item);
        }
        setUploadImages(uploadImages.filter((e) => e.name !== image.name));
    };
    // setUploadImages(uploadImages.filter((e) => e !== image));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNameErr("");
        setCodeErr("");
        setDescriptionContentErr("");
        setPriceErr("");
        setCategoryErr("");

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
            setCategoryErr(`Chọn loại cho sản phẩm`);
        }

        if (!isUpload) {
            err = true;
            setLoading(true);
        }

        setLoading(true);

        if (err) return;

        const productItem = {
            name,
            descriptionContent,
            detailContent,
            inStock,
            categorySelected,
            tags,
        };

        console.log(productItem);
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
                                            (editorRef.current = editor)
                                        }
                                        init={{
                                            menubar: false,
                                            max_height: 200,
                                            selector: "textarea",
                                            a11y_advanced_options: true,
                                            branding: false,
                                        }}
                                        onChange={(e) =>
                                            setDescriptionContent(
                                                editorRef.current.getContent()
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
                                            (editorRef.current = editor)
                                        }
                                        init={{
                                            menubar: false,

                                            selector: "textarea",
                                            a11y_advanced_options: true,
                                            branding: false,
                                        }}
                                        onChange={(e) =>
                                            setDetailContent(
                                                editorRef.current.getContent()
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
                                            selectedImages.map(
                                                (image, index) => (
                                                    <Box key={index}>
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
                                                )
                                            )}
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
                                        defaultValue={categorySelected}
                                        value={categorySelected}
                                        label="Loại sản phẩm"
                                        fullWidth
                                        error={categoryErr !== ""}
                                        onChange={(e, value) =>
                                            setCategorySelected(e.target.value)
                                        }
                                    >
                                        <MenuItem value={"123"}>123</MenuItem>
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
                                    id="checkboxes-tags-demo"
                                    options={top100Films}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.title}
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
                                            {option.title}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tags"
                                            placeholder="Favorites"
                                        />
                                    )}
                                />
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
            >
                <Alert sx={{ backgroundColor: "#f0bd71" }}>
                    Đã tải ảnh lên could
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default CreateProduct;
