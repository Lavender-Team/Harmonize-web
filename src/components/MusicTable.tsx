/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { Music } from "TYPES";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (a[orderBy] > b[orderBy]) {
        return -1;
    }
    if (a[orderBy] < b[orderBy]) {
        return 1;
    }
    return 0;
}

// 여기서 Order 타입을 정의합니다.
type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function RowMenu({
    musicId,
    deleteMusic,
}: {
    musicId: number;
    deleteMusic: (musicId: number) => void;
}) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                    root: { variant: "plain", color: "neutral", size: "sm" },
                }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem
                    component={RouterLink}
                    to={"/music-manage/edit/" + musicId}
                >
                    음악 편집
                </MenuItem>
                <MenuItem
                    component={RouterLink}
                    to={"/analyze-music?id=" + musicId}
                >
                    음악 분석
                </MenuItem>
                <Divider />
                <MenuItem
                    color="danger"
                    onClick={() => {
                        deleteMusic(musicId);
                    }}
                >
                    음악 삭제
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}

function getPageStringList(currentPage: number, totalPages: number) {
    const pageList = [currentPage];
    let left = currentPage - 1;
    let right = currentPage + 1;

    while (pageList.length < 5 && (left > 0 || right <= totalPages)) {
        if (left > 0) {
            pageList.unshift(left);
            left -= 1;
        }
        if (pageList.length < 5 && right <= totalPages) {
            pageList.push(right);
            right += 1;
        }
    }

    return pageList;
}

export default function MusicTable({
    rows,
    currentPage,
    totalElements,
    totalPages,
    navigatePage,
    deleteMusic,
    query,
    setQuery,
    search,
}: {
    rows: Music[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
    navigatePage: (page: number) => void;
    deleteMusic: (musicId: number) => void;
    query: string;
    setQuery: (query: string) => void;
    search: () => void;
}) {
    // 여기서 Order 타입을 사용합니다.
    const [order, setOrder] = React.useState<Order>("desc");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);
    const renderFilters = () => <React.Fragment></React.Fragment>;

    return (
        <React.Fragment>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{
                    display: { xs: "flex", sm: "none" },
                    my: 1,
                    gap: 1,
                }}
            >
                <Input
                    size="sm"
                    placeholder="Search"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog
                        aria-labelledby="filter-modal"
                        layout="fullscreen"
                    >
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Filters
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {renderFilters()}
                            <Button
                                color="primary"
                                onClick={() => setOpen(false)}
                            >
                                Submit
                            </Button>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    py: "-4px",
                    display: { xs: "none", sm: "flex" },
                    flexWrap: "wrap",
                    gap: 1.5,
                    justifyContent: "flex-end",
                    "& > *": {
                        minWidth: { xs: "120px", md: "160px" },
                    },
                }}
            >
                <FormControl sx={{ width: 380 }} size="sm">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                search();
                            }
                        }}
                        size="sm"
                        placeholder="음악 검색"
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: "none", sm: "initial" },
                    width: "100%",
                    borderRadius: "sm",
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px",
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                style={{
                                    width: 48,
                                    textAlign: "center",
                                    padding: "12px 6px",
                                }}
                            >
                                <Checkbox
                                    size="sm"
                                    indeterminate={
                                        selected.length > 0 &&
                                        selected.length !== rows.length
                                    }
                                    checked={selected.length === rows.length}
                                    onChange={(event) => {
                                        setSelected(
                                            event.target.checked
                                                ? rows.map((row) =>
                                                      row.id.toString()
                                                  )
                                                : []
                                        );
                                    }}
                                    color={
                                        selected.length > 0 ||
                                        selected.length === rows.length
                                            ? "primary"
                                            : undefined
                                    }
                                    sx={{ verticalAlign: "text-bottom" }}
                                />
                            </th>
                            <th style={{ width: 80, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() =>
                                        setOrder(
                                            order === "asc" ? "desc" : "asc"
                                        )
                                    }
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    ID
                                </Link>
                            </th>
                            <th style={{ width: 220, padding: "12px 6px" }}>
                                제목
                            </th>
                            <th style={{ width: 160, padding: "12px 6px" }}>
                                가수
                            </th>
                            <th style={{ width: 80, padding: "12px 6px" }}>
                                장르
                            </th>
                            <th style={{ width: 80, padding: "12px 6px" }}>
                                분석 상태
                            </th>
                            <th style={{ width: 70, padding: "12px 6px" }}>
                                조회수
                            </th>
                            <th style={{ width: 70, padding: "12px 6px" }}>
                                좋아요
                            </th>
                            <th style={{ width: 100, padding: "12px 6px" }}>
                                편집
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...rows]
                            .sort(getComparator(order, "id"))
                            .map((row) => (
                                <tr key={row.id}>
                                    <td
                                        style={{
                                            textAlign: "center",
                                            width: 120,
                                        }}
                                    >
                                        <Checkbox
                                            size="sm"
                                            checked={selected.includes(
                                                row.id.toString()
                                            )}
                                            color={
                                                selected.includes(
                                                    row.id.toString()
                                                )
                                                    ? "primary"
                                                    : undefined
                                            }
                                            onChange={(event) => {
                                                setSelected((ids) =>
                                                    event.target.checked
                                                        ? ids.concat(
                                                              row.id.toString()
                                                          )
                                                        : ids.filter(
                                                              (itemId) =>
                                                                  itemId !==
                                                                  row.id.toString()
                                                          )
                                                );
                                            }}
                                            slotProps={{
                                                checkbox: {
                                                    sx: { textAlign: "left" },
                                                },
                                            }}
                                            sx={{
                                                verticalAlign: "text-bottom",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row.id}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Link
                                            component={RouterLink}
                                            to={"/music-manage/edit/" + row.id}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Avatar
                                                    size="sm"
                                                    src={row.albumCover}
                                                    sx={{ borderRadius: "4px" }}
                                                ></Avatar>
                                                <div>
                                                    <Typography level="title-sm">
                                                        {row.title}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </Link>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row.artist}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row.genreName}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            startDecorator={
                                                {
                                                    COMPLETE: (
                                                        <CheckRoundedIcon />
                                                    ),
                                                    RUNNING: (
                                                        <AutorenewRoundedIcon />
                                                    ),
                                                    INCOMPLETE: <BlockIcon />,
                                                }[row.status]
                                            }
                                            color={
                                                {
                                                    COMPLETE: "success",
                                                    RUNNING: "neutral",
                                                    INCOMPLETE: "danger",
                                                }[
                                                    row.status
                                                ] as ColorPaletteProp
                                            }
                                        >
                                            {row.status}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row.view}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row.likes}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                alignItems: "center",
                                            }}
                                        >
                                            <RowMenu
                                                musicId={row.id}
                                                deleteMusic={deleteMusic}
                                            />
                                        </Box>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Sheet>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                }}
            >
                <Box sx={{ flex: 1, position: "relative" }}>
                    <Typography level="body-sm" sx={{ position: "absolute" }}>
                        전체 {totalElements}개, {currentPage}/{totalPages}{" "}
                        페이지
                    </Typography>
                </Box>

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<KeyboardArrowLeftIcon />}
                    onClick={() => {
                        if (1 <= currentPage - 1) navigatePage(currentPage - 1);
                    }}
                >
                    이전
                </Button>
                <Box sx={{ width: 4 }} />
                {getPageStringList(currentPage, totalPages).map((page) => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={page === currentPage ? "solid" : "outlined"}
                        color="neutral"
                        onClick={() => {
                            navigatePage(page);
                        }}
                    >
                        {page}
                    </IconButton>
                ))}
                <Box sx={{ width: 4 }} />
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    endDecorator={<KeyboardArrowRightIcon />}
                    onClick={() => {
                        if (currentPage + 1 <= totalPages)
                            navigatePage(currentPage + 1);
                    }}
                >
                    다음
                </Button>
                <Box sx={{ flex: 1 }} />
            </Box>
        </React.Fragment>
    );
}
