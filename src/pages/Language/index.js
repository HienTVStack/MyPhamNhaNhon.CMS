import { useState, Fragment, useEffect } from "react";
import { Paper, Stack, TextField, Typography, Box, Button, IconButton } from "@mui/material";
import Iconify from "src/components/Iconify";
import settingApi from "src/api/settingApi";
import Loading from "src/components/Loading";

const LANGUAGE_LIST = [
  { key: "Home", vi: "Trang chủ", en: "Home" },
  { key: "About", vi: "Về chúng tôi", en: "About" },
];

function Language() {
  const [loading, setLoading] = useState(false);
  const [languageList, setLanguageList] = useState([{ key: "", vi: "", en: "" }]);

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const res = await settingApi.get();

      if (res.success) {
        setLanguageList(res.setting.languages);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSetting();
    setLanguageList(LANGUAGE_LIST);
  }, []);

  const handleAddLanguageItem = (e, index) => {
    setLanguageList([...languageList, { key: "", vi: "", en: "" }]);
  };

  const handleChangeLanguage = (e, index) => {
    const { name, value } = e.target;
    const list = [...languageList];
    list[index][name] = value;
    setLanguageList(list);
  };

  const handleSave = async () => {
    setLoading(true);
    console.log(languageList);

    try {
      const res = await settingApi.updateLanguage({ languages: languageList });

      if (res.success) {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Box>
        <Typography variant={"subtitle1"} fontSize={24} fontWeight={"38px"}>
          Ngôn ngữ
        </Typography>
      </Box>
      {loading ? (
        <Loading />
      ) : (
        <Paper>
          <div>
            {/* <Stack>
            <Button variant={"contained"} size={"large"} startIcon={<Iconify icon={"material-symbols:add"} />}>
              Thêm mới
            </Button>
          </Stack> */}
          </div>
          {languageList?.map((x, i) => {
            return (
              <Stack key={i} direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"} p={2}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  placeholder="Key"
                  label="Key"
                  name="key"
                  id="key"
                  value={x.key}
                  onChange={(e) => handleChangeLanguage(e, i)}
                  sx={{ backgroundColor: "#ccc", borderRadius: "8px" }}
                />
                <TextField
                  required
                  fullWidth
                  value={x.vi}
                  size={"small"}
                  placeholder="Vi"
                  label="Vi"
                  name="vi"
                  id="vi"
                  onChange={(e) => handleChangeLanguage(e, i)}
                />
                <TextField
                  required
                  fullWidth
                  value={x.en}
                  size={"small"}
                  placeholder="En"
                  label="En"
                  name="en"
                  id="en"
                  onChange={(e) => handleChangeLanguage(e, i)}
                />
                <IconButton variant="outlined" color={"error"}>
                  <Iconify icon={"material-symbols:delete-rounded"} />
                </IconButton>
              </Stack>
            );
          })}
          <Stack direction={"row"} justifyContent={"space-between"} p={2}>
            <Button variant={"contained"} startIcon={<Iconify icon={"material-symbols:add"} />} onClick={handleAddLanguageItem}>
              Thêm mới
            </Button>
            <Button variant={"contained"} startIcon={<Iconify icon={"material-symbols:save"} />} onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Paper>
      )}
    </>
  );
}

export default Language;
