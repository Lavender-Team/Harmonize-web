import * as React from "react";
import {
    Avatar,
    Box,
    Checkbox,
    Table,
    Sheet,
    Typography,
    Link,
    IconButton,
    Menu,
    MenuItem,
    Dropdown,
    MenuButton,
    Divider,
    Input,
    Button,
} from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type User = {
    userId: number;
    loginId: string;
    email: string;
    nickname: string;
    role: string;
    gender: string;
    age: number;
    createdAt: string;
    deletedAt: string | null;
    isDeleted: boolean;
    isBanned: boolean;
    isLocked: boolean;
    profileImage: string;
};

type UserTableProps = {
    rows: User[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
    navigatePage: (page: number) => void;
    deleteUser: (userId: number) => void;
    query: string;
    setQuery: (query: string) => void;
    search: () => void;
};

type Order = "asc" | "desc";

function descendingComparator(a: User, b: User, orderBy: keyof User): number {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    // null 또는 undefined 값 처리
    if (aValue == null && bValue != null) {
        return 1;
    }
    if (aValue != null && bValue == null) {
        return -1;
    }
    if (aValue == null && bValue == null) {
        return 0;
    }

    // 타입에 따른 비교 로직
    if (typeof aValue === "string" && typeof bValue === "string") {
        return bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
        return bValue - aValue;
    } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return aValue === bValue ? 0 : aValue ? -1 : 1;
    } else {
        return 0;
    }
}

function getComparator(
    order: Order,
    orderBy: keyof User
): (a: User, b: User) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu({
    userId,
    deleteUser,
}: {
    userId: number;
    deleteUser: (userId: number) => void;
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
                    to={"/user-manage/edit/" + userId}
                >
                    사용자 편집
                </MenuItem>
                <Divider />
                <MenuItem
                    color="danger"
                    onClick={() => {
                        deleteUser(userId);
                    }}
                >
                    사용자 삭제
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function UserTable({
    rows = [],
    currentPage,
    totalElements,
    totalPages,
    navigatePage,
    deleteUser,
    query,
    setQuery,
    search,
}: UserTableProps) {
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof User>("userId");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleRequestSort = (property: keyof User) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <React.Fragment>
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
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search();
                        }
                    }}
                    size="sm"
                    placeholder="닉네임 검색"
                    sx={{ flexGrow: 1, maxWidth: "300px" }}
                />
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
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
                                                      row.userId.toString()
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
                            <th style={{ width: 40, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("userId")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "userId" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    ID
                                </Link>
                            </th>
                            <th style={{ width: 160, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("loginId")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "loginId" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    로그인 ID
                                </Link>
                            </th>
                            <th style={{ width: 220, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("email")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "email" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    이메일
                                </Link>
                            </th>
                            <th style={{ width: 120, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() =>
                                        handleRequestSort("nickname")
                                    }
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "nickname" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    닉네임
                                </Link>
                            </th>
                            <th style={{ width: 80, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("role")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "role" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    역할
                                </Link>
                            </th>
                            <th style={{ width: 60, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("gender")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "gender" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    성별
                                </Link>
                            </th>
                            <th style={{ width: 40, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => handleRequestSort("age")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "age" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    나이
                                </Link>
                            </th>
                            <th style={{ width: 160, padding: "12px 6px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() =>
                                        handleRequestSort("createdAt")
                                    }
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                orderBy === "createdAt" &&
                                                order === "desc"
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    가입일
                                </Link>
                            </th>
                            <th style={{ width: 60, padding: "12px 6px" }}>
                                삭제됨
                            </th>
                            <th style={{ width: 60, padding: "12px 6px" }}>
                                차단됨
                            </th>
                            <th style={{ width: 60, padding: "12px 6px" }}>
                                잠금
                            </th>
                            <th style={{ width: 70, padding: "12px 6px" }}>
                                편집
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...rows]
                            .sort(getComparator(order, orderBy))
                            .map((row) => (
                                <tr
                                    key={row?.userId}
                                    style={{
                                        textDecoration: row?.isDeleted
                                            ? "line-through"
                                            : "",
                                    }}
                                >
                                    <td style={{ textAlign: "center" }}>
                                        <Checkbox
                                            size="sm"
                                            checked={selected.includes(
                                                row?.userId?.toString() || ""
                                            )}
                                            color={
                                                selected.includes(
                                                    row?.userId?.toString() ||
                                                        ""
                                                )
                                                    ? "primary"
                                                    : undefined
                                            }
                                            onChange={(event) => {
                                                setSelected((ids) =>
                                                    event.target.checked
                                                        ? ids.concat(
                                                              row?.userId?.toString() ||
                                                                  ""
                                                          )
                                                        : ids.filter(
                                                              (itemId) =>
                                                                  itemId !==
                                                                  row?.userId?.toString()
                                                          )
                                                );
                                            }}
                                            sx={{
                                                verticalAlign: "text-bottom",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.userId?.toString() || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Link
                                            component={RouterLink}
                                            to={
                                                "/user-manage/edit/" +
                                                row?.userId
                                            }
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
                                                    src={
                                                        row?.profileImage || ""
                                                    }
                                                    sx={{ borderRadius: "4px" }}
                                                ></Avatar>
                                                <div>
                                                    <Typography level="title-sm">
                                                        {row?.loginId || "N/A"}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </Link>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.email || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.nickname || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.role || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.gender || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.age?.toString() || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.createdAt
                                                ? new Date(
                                                      row.createdAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.isDeleted ? "Yes" : "No"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.isBanned ? "Yes" : "No"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {row?.isLocked ? "Yes" : "No"}
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
                                                userId={row?.userId || 0}
                                                deleteUser={deleteUser}
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
                    [`& .MuiIconButton-root`]: { borderRadius: "50%" },
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <IconButton
                            key={page}
                            size="sm"
                            variant={
                                page === currentPage ? "solid" : "outlined"
                            }
                            color="neutral"
                            onClick={() => navigatePage(page)}
                        >
                            {page}
                        </IconButton>
                    )
                )}
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
