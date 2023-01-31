import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Stack, Select, MenuItem } from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  // width: 240,
  flex: 1,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

ProductListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  productsSelected: PropTypes.array,
  destroyMultipleProduct: PropTypes.func,
};

export default function ProductListToolbar({
  numSelected,
  filterName,
  onFilterName,
  productsSelected,
  destroyMultipleProduct,
  selectInStock,
  productList,
}) {
  const handleDeleteMultipleProduct = (idList) => {
    destroyMultipleProduct(idList);
  };

  const handleSelectInStock = (e) => {
    const value = e.target.value;
    selectInStock(value);
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack flex={1} direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
          <Select defaultValue={0} onChange={handleSelectInStock} sx={{ minWidth: 250 }}>
            <MenuItem value={0}>Tất cả ({productList.length})</MenuItem>
            <MenuItem value={1}>Đăng bán ({productList.filter((item) => item.inStock === true).length})</MenuItem>
            <MenuItem value={2}>Chưa đăng bán ({productList.filter((item) => item.inStock === false).length})</MenuItem>
            <MenuItem value={3}>Bán tại Tiki ({productList.filter((item) => item.isSyncTiki === true).length})</MenuItem>
          </Select>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{
                    color: "text.disabled",
                    width: 20,
                    height: 20,
                  }}
                />
              </InputAdornment>
            }
          />
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteMultipleProduct(productsSelected)}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
