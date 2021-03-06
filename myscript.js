/*
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 */
var PI = Math.PI;

/* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
function INT(d) {
	return Math.floor(d);
}

/* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number 
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy. 
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
function jdFromDate(dd, mm, yy) {
	var a, y, m, jd;
	a = INT((14 - mm) / 12);
	y = yy+4800-a;
	m = mm+12*a-3;
	jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
	if (jd < 2299161) {
		jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
	}
	return jd;
}

/* Convert a Julian day number to day/month/year. Parameter jd is an integer */
function jdToDate(jd) {
	var a, b, c, d, e, m, day, month, year;
	if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
		a = jd + 32044;
		b = INT((4*a+3)/146097);
		c = a - INT((b*146097)/4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	d = INT((4*c+3)/1461);
	e = c - INT((1461*d)/4);
	m = INT((5*e+2)/153);
	day = e - INT((153*m+2)/5) + 1;
	month = m + 3 - 12*INT(m/10);
	year = b*100 + d - 4800 + INT(m/10);
	return new Array(day, month, year);
}

/* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT 
 * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function NewMoon(k) {
	var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
	T = k/1236.85; // Time in Julian centuries from 1900 January 0.5
	T2 = T * T;
	T3 = T2 * T;
	dr = PI/180;
	Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
	Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
	M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
	Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
	F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
	C1=(0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
	C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
	C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
	C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
	C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
	C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
	C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
	if (T < -11) {
		deltat= 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
	} else {
		deltat= -0.000278 + 0.000265*T + 0.000262*T2;
	};
	JdNew = Jd1 + C1 - deltat;
	return JdNew;
}

/* Compute the longitude of the sun at any time. 
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function SunLongitude(jdn) {
	var T, T2, dr, M, L0, DL, L;
	T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
	T2 = T*T;
	dr = PI/180; // degree to radian
	M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
	L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
	DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
	DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
	L = L0 + DL; // true longitude, degree
	L = L*dr;
	L = L - PI*2*(INT(L/(PI*2))); // Normalize to (0, 2*PI)
	return L;
}

/* Compute sun position at midnight of the day with the given Julian day number. 
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The function returns a number between 0 and 11. 
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned. 
 * After that, return 1, 2, 3 ... 
 */
function getSunLongitude(dayNumber, timeZone) {
	return INT(SunLongitude(dayNumber - 0.5 - timeZone/24)/PI*6);
}

/* Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 */
function getNewMoonDay(k, timeZone) {
	return INT(NewMoon(k) + 0.5 + timeZone/24);
}

/* Find the day that starts the luner month 11 of the given year for the given time zone */
function getLunarMonth11(yy, timeZone) {
	var k, off, nm, sunLong;
	//off = jdFromDate(31, 12, yy) - 2415021.076998695;
	off = jdFromDate(31, 12, yy) - 2415021;
	k = INT(off / 29.530588853);
	nm = getNewMoonDay(k, timeZone);
	sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
	if (sunLong >= 9) {
		nm = getNewMoonDay(k-1, timeZone);
	}
	return nm;
}

/* Find the index of the leap month after the month starting on the day a11. */
function getLeapMonthOffset(a11, timeZone) {
	var k, last, arc, i;
	k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	last = 0;
	i = 1; // We start with the month following lunar month 11
	arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	do {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	} while (arc != last && i < 14);
	return i-1;
}

/* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
function convertSolar2Lunar(dd, mm, yy, timeZone) {
	var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
	dayNumber = jdFromDate(dd, mm, yy);
	k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	monthStart = getNewMoonDay(k+1, timeZone);
	if (monthStart > dayNumber) {
		monthStart = getNewMoonDay(k, timeZone);
	}
	//alert(dayNumber+" -> "+monthStart);
	a11 = getLunarMonth11(yy, timeZone);
	b11 = a11;
	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy-1, timeZone);
	} else {
		lunarYear = yy+1;
		b11 = getLunarMonth11(yy+1, timeZone);
	}
	lunarDay = dayNumber-monthStart+1;
	diff = INT((monthStart - a11)/29);
	lunarLeap = 0;
	lunarMonth = diff+11;
	if (b11 - a11 > 365) {
		leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff == leapMonthDiff) {
				lunarLeap = 1;
			}
		}
	}
	if (lunarMonth > 12) {
		lunarMonth = lunarMonth - 12;
	}
	if (lunarMonth >= 11 && diff < 4) {
		lunarYear -= 1;
	}
	return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
}

/* Convert a lunar date to the corresponding solar date */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
	var k, a11, b11, off, leapOff, leapMonth, monthStart;
	if (lunarMonth < 11) {
		a11 = getLunarMonth11(lunarYear-1, timeZone);
		b11 = getLunarMonth11(lunarYear, timeZone);
	} else {
		a11 = getLunarMonth11(lunarYear, timeZone);
		b11 = getLunarMonth11(lunarYear+1, timeZone);
	}
	k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
	off = lunarMonth - 11;
	if (off < 0) {
		off += 12;
	}
	if (b11 - a11 > 365) {
		leapOff = getLeapMonthOffset(a11, timeZone);
		leapMonth = leapOff - 2;
		if (leapMonth < 0) {
			leapMonth += 12;
		}
		if (lunarLeap != 0 && lunarMonth != leapMonth) {
			return new Array(0, 0, 0);
		} else if (lunarLeap != 0 || off >= leapOff) {
			off += 1;
		}
	}
	monthStart = getNewMoonDay(k+off, timeZone);
	return jdToDate(monthStart+lunarDay-1);
}

const AnTuVi = [
    ["Tử Vi, Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Liêm Trinh, Thiên Tướng", "Thiên Lương", "Thất Sát", "Thiên Đồng", "Vũ Khúc", "Thái Dương","Phá Quân", "Thiên Cơ"],
    ["Thiên Cơ, Thái Âm", "Tử Vi, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Liêm Trinh, Thất Sát", " ", " ", "Thiên Đồng", "Vũ Khúc, Phá Quân", "Thái Dương", "Thiên Phủ"],
    ["Tham Lang", "Cự Môn, Thiên Cơ", "Tử Vi, Thiên Tướng", "Thiên Lương", "Thất Sát", " ", "Liêm Trinh", " ", "Phá Quân", "Thiên Đồng", "Vũ Khúc, Thiên Phủ", "Thái Dương, Thái Âm"],
    ["Thái Dương, Cự Môn", "Thiên Tướng", "Thiên Cơ, Thiên Lương", "Tử Vi, Thất Sát", " ", " ", " ", "Liêm Trinh, Phá Quân", " ", "Thiên Phủ", "Thiên Đồng, Thái Âm", "Vũ Khúc, Tham Lang"],
    ["Vũ Khúc, Thiên Tướng", "Thái Dương, Thiên Lương", "Thất Sát", "Thiên Cơ", "Tử Vi", " ", "Phá Quân", " ", "Liêm Trinh, Thiên Phủ", "Thái Âm", "Tham Lang", "Thiên Đồng, Cự Môn"],
    ["Thiên Đồng, Thiên Lương", "Vũ Khúc, Thất Sát", "Thái Dương", " ", "Thiên Cơ", "Tử Vi, Phá Quân", " ", "Thiên Phủ", "Thái Âm", "Liêm Trinh, Tham Lang", "Cự Môn", "Thiên Tướng"],
    ["Thất Sát", "Thiên Đồng", "Vũ Khúc", "Thái Dương", "Phá Quân", "Thiên Cơ", "Tử Vi, Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Liêm Trinh, Thiên Tướng", "Thiên Lương"],
    [" ", " ", "Thiên Đồng", "Vũ Khúc, Phá Quân", "Thái Dương", "Thiên Phủ", "Thiên Cơ, Thái Âm", "Tử Vi, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Liêm Trinh, Thất Sát"],
    ["Liêm Trinh", " ", "Phá Quân", "Thiên Đồng", "Vũ Khúc, Thiên Phủ", "Thái Dương, Thái Âm", "Tham Lang", "Thiên Cơ, Cự Môn", "Tử Vi, Thiên Tướng", "Thiên Lương", "Thất Sát", " "],
    [" ", "Liêm Trinh, Phá Quân", " ", "Thiên Phủ", "Thiên Đồng, Thái Âm", "Vũ Khúc, Tham Lang", "Thái Dương, Cự Môn", "Thiên Tướng", "Thiên Cơ, Thiên Lương", "Tử Vi, Thất Sát", " ", " "],
    ["Phá Quân", " ", "Liêm Trinh, Thiên Phủ", "Thái Âm", "Tham Lang", "Thiên Đồng, Cự Môn", "Vũ Khúc, Thiên Tướng", "Thái Dương, Thiên Lương", "Thất Sát", "Thiên Cơ", "Tử Vi", " "],
    [" ", "Thiên Phủ", "Thái Âm", "Liêm Trinh, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Đồng, Thiên Lương", "Vũ Khúc, Thất Sát", "Thái Dương", " ", "Thiên Cơ", "Tử Vi, Phá Quân"]
    ]
const ChieuThuan = ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu"];
const AnTrangSinh = ["Tràng sinh", "Dưỡng", "Thai", "Tuyệt", "Mộ", "Tử", "Bệnh", "Suy", "Đế Vượng", "Lâm Quan", "Quan Đới", "Mộc Dục"];
const AnThaiTue = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];
const AnLocTon = [ "Lộc Tồn, Bác Sỹ", "Lực Sỹ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];
const idDaiVan = ["DaiVan1","DaiVan2","DaiVan3","DaiVan4","DaiVan5","DaiVan6","DaiVan7","DaiVan8","DaiVan9","DaiVan10","DaiVan11","DaiVan12"];
const idTieuVan = ["TieuVan1","TieuVan2","TieuVan3","TieuVan4","TieuVan5","TieuVan6","TieuVan7","TieuVan8","TieuVan9","TieuVan10","TieuVan11","TieuVan12"];
const CungDiaBan = ["Dần Mộc +", "Mão Mộc -", "Thìn Thổ +", "Tỵ Hỏa -", "Ngọ Hỏa +", "Mùi Thổ -", "Thân Kim +", "Dậu Kim -", "Tuất Thổ +", "Hợi Thủy -", "Tý Thủy +", "Sửu Thổ -"];
const CungMenh = ["MỆNH VIÊN", "PHỤ MẪU", "PHÚC ĐỨC", "ĐIỀN TRẠCH", "QUAN LỘC", "NÔ BỘC", "THIÊN DI", "TẬT ÁCH", "TÀI BẠCH", "TỬ TỨC", "PHU THÊ", "HUYNH ĐỆ"];
const ThienCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DiaChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const Cuc = ["Thủy Nhị Cục", "Mộc Tam Cục", "Kim Tứ Cục", "Thổ Ngũ Cục", "Hỏa Lục Cục"];
const ngayThuyNhiCuc = [[2,3,26,27], [4,5,28,29], [6,7,30], [8,9], [10,11], [12,13], [14,15], [16,17], [18,19], [20,21], [22,23], [1,24,25]];
const ngayMocTamCuc = [[5,3],[6,8],[1,9,11],[4,12,14],[7,17,15],[10,20,18],[13,21,23],[16,24,26],[19,27,29],[22,30],[25],[2,28]];
const ngayKimTuCuc = [[4,7,13],[8,11,17],[2,12,15,21],[6,16,19,25],[10,20,23,29],[14,24,27],[18,28],[22],[26],[1,30],[5],[3,9]];
const ngayThoNguCuc = [[5,9,17],[10,14,22],[3,15,19,27],[8,20,24],[1,13,25,29],[6,18,30],[11,23],[16,28],[21],[2,26],[7],[4,12]];
const ngayHoaLucCuc = [[6,11,21],[12,17,27],[4,18,23],[10,24,29],[2,16,30],[8,22],[14,28],[1,20],[7,26],[3,13],[9,19],[5,15,25]];

var viTriThan;
var ViTriMenh;
var ViTriTuVi;

var HovaTen = localStorage.hovaten;
var GioiTinh = localStorage.gioitinh;
var NgaySinh = localStorage.ngaysinh;
var ThangSinh = localStorage.thangsinh;
var NamSinh = localStorage.namsinh;
var GioSinh = localStorage.giosinh;

var Lich = localStorage.lich;

if(Lich === "false")
{
    var converted = convertSolar2Lunar(parseInt(NgaySinh),parseInt(ThangSinh),parseInt(NamSinh),7);
    NgaySinh = converted[0];
    ThangSinh = converted[1];
    NamSinh = converted[2];
}

var CanSinh = tinhCanSinh(NamSinh);
var ChiSinh = tinhChiSinh(NamSinh);

//Tải Cung Địa Bàn
for (let i = 0; i < 12; i++) {
    let id = "CungDiaBan" + (i + 1);
    document.getElementById(id).innerHTML = CungDiaBan[i].toString();
}

//Tải Thiên Bàn
document.getElementById("hovaten").innerHTML = HovaTen;
document.getElementById("ngaysinh").innerHTML = "Âm lịch: Giờ " + GioSinh + " " + NgaySinh + "-" + ThangSinh + " " + tinhCanSinh(NamSinh) + " " + tinhChiSinh(NamSinh);

localStorage.removeItem("lich");
localStorage.removeItem("hovaten");
localStorage.removeItem("giosinh");
localStorage.removeItem("ngaysinh");
localStorage.removeItem("thangsinh");
localStorage.removeItem("namsinh");
localStorage.removeItem("gioitinh");

//Định Cung Mạng, Thân, và các Cung khác
var x = DiaChi.indexOf(GioSinh) + 1;

dinhCungMangThan(parseInt(x), parseInt(ThangSinh));

//Định Cục
var cuc = dinhCuc(CanSinh, ChiSinh);

//Tìm Bản Mệnh
document.getElementById("BanMenh").innerHTML = timBanMenh(CanSinh, ChiSinh);

//Tính Đại vận, Tiểu Vận
tinhDaiTieu(GioiTinh, ChiSinh, cuc);

//An Tử Vi
anTuVi(cuc, parseInt(NgaySinh));

//An Tràng Sinh
anTrangSinh(cuc, GioiTinh);

//An Thái Tuế
anThaiTue(ChiSinh);

//An Lộc Tồn
anLocTon(CanSinh, GioiTinh);

//An Sao theo Thiên Can
anSaoTheoCan(CanSinh);

//An Sao theo Địa Chi
anSaoTheoChi(ChiSinh);

//An Sao theo Tháng Sinh
anSaoTheoThang(parseInt(ThangSinh));

//An Sao theo Giờ Sinh
anSaoTheoGio(GioSinh);

//An Tuần Triệt
anTuanTriet(CanSinh, ChiSinh);

//An Sao Cố Định
anSaoCoDinh();

//An Sao Đẩu Quân
saoDauQuan(parseInt(ThangSinh), GioSinh);

saoAnQuang(parseInt(NgaySinh));

saoThienQuy(parseInt(NgaySinh));

saoTamTai(parseInt(NgaySinh));

saoBatToa(parseInt(NgaySinh));

saoHoaLinh(ChiSinh, GioSinh, GioiTinh);

function tinhCanSinh(namSinh)
{
    let can = namSinh%10 - 4;
    if(can < 0) can = can +10;
    return ThienCan[can];
}

function tinhChiSinh(namSinh)
{
    let chi = namSinh%12 - 4;
    if(chi < 0) chi = chi + 12;
    return DiaChi[chi];

}

function dinhCungMangThan(gioSinh, thangSinh)
{
    //Định Cung Thân
    viTriThan = thangSinh + gioSinh - 2;
    if(viTriThan > 11) viTriThan = viTriThan -12;
    
    //Định Cung Mệnh
    if(thangSinh == gioSinh) ViTriMenh = 0;
    else if(thangSinh > gioSinh) ViTriMenh = (thangSinh - gioSinh);
    else if(thangSinh < gioSinh) ViTriMenh = (12 + thangSinh - gioSinh);
    //Tải Cung Mệnh
    for(let i = 0; i < 12 ; i++)
    {
        let index = i + ViTriMenh;
        if(index > 11) index = index - 12;
        
        let id = "CungMenh" + (index + 1);
        document.getElementById(id).innerHTML = CungMenh[i].toString();
        if(index == viTriThan)
        {
            document.getElementById("CungThan").innerHTML = "Thân tại: " + CungMenh[i].toString();
        }
    }
}

function dinhCuc(Can, Chi)
{
    switch(Chi)
    {
        case "Tý":
        case "Sửu":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
            }
        }break;
        case "Dần":
        case "Mão":
        case "Tuất":
        case "Hợi":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
            }
        }break;
        case "Thìn":
        case "Tỵ":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
            }
        }break;
        case "Ngọ":
        case "Mùi":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
            }
        }break;
        case "Thân":
        case "Dậu":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
            }
        }break;
    }
}

function timBanMenh(Can, Chi)
{
    switch(Can + ' ' + Chi)
    {
        case "Giáp Tý":
        case "Ất Sửu": 
        return "Hải trung kim (vàng đáy biển)";
        case "Bính Dần": 
        case "Đinh Mão": 
        return "Lô trung Hỏa (lửa trong lò);"
        case "Mậu Thìn": 
        case "Kỷ Mão": 
        return "Đại lâm mộc (cây ở trong rừng)";
        case "Canh Ngọ": 
        case "Tân Mùi": 
        return "Lộ bàng thổ (đất bên đường)";
        case "Nhâm Thân": 
        case "Quý Dậu": 
        return "Kiếm phong kim (vàng đầy gươm)";
        case "Giáp Tuất": 
        case "Ất Hợi": 
        return "Sơn đầu hỏa (lửa đầu núi)";
        case "Bính Tý": 
        case "Đinh Sửu": 
        return "Giản hạ thủy (nước khe suối)";
        case "Mậu Dần": 
        case "Kỷ Mão": 
        return "Thành đầu thổ (đất đầu thành)";
        case "Canh Thìn": 
        case "Tân Tỵ": 
        return "Bạch lạp kim (đèn nến trắng)";
        case "Nhâm Ngọ": 
        case "Quý Mùi":  
        return "Dương liễu mộc (cây dương liễu)";
        case "Giáp Thân": 
        case "Ất Dậu":
        return "Tuyền trung thủy (nước giữa suối)";
        case "Bính Tuất":
        case "Đinh Hợi" : 
        return "Ốc thượng thổ (đất mái nhà);"
        case "Mậu Tý": 
        case "Kỷ Sửu": 
        return "Tích lịch hỏa (lửa sấm sét)";
        case "Canh Dần": 
        case "Tân Mão": 
        return "Tòng bách mộc (cây tòng bách)";
        case "Nhâm Thìn": 
        case "Quý Tỵ":  
        return "Tràng lưu thủy (nước dòng sông)";
        case "Giáp Ngọ": 
        case "Ất Mùi" : 
        return "Sa trung kim (vàng trong cát)";
        case "Bính Thân": 
        case "Đinh Dậu" : 
        return "Sơn hạ hỏa (lửa dưới cát)";
        case "Mậu Tuất": 
        case "Kỷ Hợi": 
        return "Bình địa mộc (cây đồng bằng)";
        case "Canh Tý": 
        case "Tân Sửu": 
        return "Bịch thượng thổ (đất trên vách);"
        case "Nhâm Dần": 
        case "Quý Mão": 
        return "Kim bạch kim (vàng bạch kim)";
        case "Giáp Thìn": 
        case "Ất Tỵ": 
        return "Phú đăng hỏa (lửa ngọn đèn lớn)";
        case "Bính Ngọ": 
        case "Đinh Mùi": 
        return "Thiên thượng thủy (nước trên trời)";
        case "Mậu Thân": 
        case "Kỷ Dậu": 
        return "Đất trach thổ (đất làm nhà)";
        case "Canh Tuất": 
        case "Tân Hợi": 
        return "Xuyến thoa kim (vàng trong tay)";
        case "Nhâm Tý": 
        case "Quý Sửu": 
        return "Tang khô mộc (gỗ cây dâu)";
        case "Giáp Dần": 
        case "Ất Mão": 
        return "Đại khê thủy (nước suối lớn)";
        case "Bính Thìn": 
        case "Đinh Tỵ": 
        return "Sa trung thổ (đất giữa cát)";
        case "Mậu Ngọ": 
        case "Kỷ Mùi": 
        return "Thiên thượng hỏa (lửa trên trời)";
        case "Canh Thân": 
        case "Tân Dậu": 
        return "Thạch lựu mộc (cây thạch lựu)";
        case "Nhâm Tuất": 
        case "Quý Hợi": 
        return "Đại hải thuỷ (nước biển lớn)";
    }
}

function tinhDaiTieu(NamOrNu, Chi, tenCuc)
{
    var index;
    switch(Chi)
    {
        case "Dần":
        case "Ngọ":
        case "Tuất":
        {
            index = 2;
        }break;
        case "Tỵ":
        case "Dậu":
        case "Sửu":
        {
            index = 5;
        }break;
        case "Thân":
        case "Tý":
        case "Thìn":
        {
            index = 8;
        }break;
        case "Hợi":
        case "Mão":
        case "Mùi":
        {
            index = 11;
        }break;
    }

    if(NamOrNu == "Nam")
    {
        for(let i = 0; i < 12; i++)
        {
            let j = i + index;
            let k = i + DiaChi.indexOf(Chi);
            if(j > 11) j = j - 12;
            if(k > 11) k = k - 12;
            document.getElementById(idDaiVan[j].toString()).innerHTML = DiaChi[k].toString();
        }

        if(ViTriMenh%2 === 1) //Nam Dương
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh - i;
                if(j < 0) j = j + 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //Nam Âm
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
    }
    else if(NamOrNu == "Nữ")
    {
        for(let i = 0; i < 12; i++)
        {
            let j = i + index;
            let k = DiaChi.indexOf(Chi) - i;
            if(j > 11) j = j - 12;
            if(k < 0) k = k + 12;
            document.getElementById(idDaiVan[j].toString()).innerHTML = DiaChi[k].toString();
        }
        if(ViTriMenh%2 === 1) //Nữ Âm
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //Nữ Dương
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh - i;
                if(j < 0) j = j + 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
    }
}

function timTuVi(ngayCuc, ngaySinh)
{

    for(let i = 0; i < 12; i++)
    {
        const item = ngayCuc[i].slice();
        if(item.indexOf(ngaySinh) > -1)
        {
            return i;
        }
    }
    return -1;
}

function anTuVi(tenCuc, ngaySinh)
{
    let index = -1;
    switch(tenCuc)
    {
        case Cuc[0]:
            index = timTuVi(ngayThuyNhiCuc, ngaySinh);
            break;
        case Cuc[1]:
            index = timTuVi(ngayMocTamCuc, ngaySinh);
            break;
        case Cuc[2]:
            index = timTuVi(ngayKimTuCuc, ngaySinh);
            break;
        case Cuc[3]:
            index = timTuVi(ngayThoNguCuc, ngaySinh);
            break;
        case Cuc[4]:
            index = timTuVi(ngayHoaLucCuc, ngaySinh);
            break;
    }
    const item = AnTuVi[index].slice();
    for(let i = 0; i < 12; i++)
    {
        let id = "AnTuVi" + (i + 1);
        document.getElementById(id).innerHTML = item[i].toString();
    }
}

function anTrangSinh(tenCuc, NamOrNu)
{
    let index = -1;
    switch(tenCuc)
    {
        case Cuc[0]:
            index = 6; //Thân
            break;
        case Cuc[1]:
            index = 9; //Hợi
            break;
        case Cuc[2]:
            index = 3; //Tỵ
            break;
        case Cuc[3]:
            index = 6; //Thân
            break;
        case Cuc[4]:
            index = 0; //Dần
            break;
    }
    if(NamOrNu === "Nam")
    {
        if(ViTriMenh%2 === 1) //Dương Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //Âm Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
    }
    else if(NamOrNu === "Nữ")
    {
        if(ViTriMenh%2 === 1) //Âm nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //Dương Nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
    }
}

function anThaiTue(tenChi)
{
    let index = DiaChi.indexOf(tenChi) - 2;
    if(index < 0) index = 12 + index;

    for(let i = 0; i < 12; i++)
    {
        let j = index + i;
        if(j > 11) j = j - 12;
        let id = "AnThaiTue" + (j + 1);
        document.getElementById(id).innerHTML = AnThaiTue[i].toString();
    }
}

function anLocTon(tenCan, NamOrNu)
{
    const Can=[0,1,3,4,3,4,6,7,9,10];
    const index = Can[ThienCan.indexOf(tenCan)];

    
    if(NamOrNu === "Nam")
    {
        if(ViTriMenh%2 === 0) //Dương Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //Âm Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
    }
    else if(NamOrNu === "Nữ")
    {
        if(ViTriMenh%2 === 0) //Âm nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //Dương Nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
    }

    var index_DaLa = index -1;
    if(index_DaLa < 0) index_DaLa = index_DaLa +12;
    var index_KinhDuong = index +1;
    if(index_KinhDuong > 11) index_KinhDuong = index_KinhDuong -12;
    
    let idDaLa = "SaoKhac" + (index_DaLa + 1);
    let idKinhDuong = "SaoKhac" + (index_KinhDuong + 1);
    document.getElementById(idDaLa).innerHTML = "Đà La <br>";
    document.getElementById(idKinhDuong).innerHTML = "Kình Dương<br>";
    
}

function saoThienKhoi(tenCan)
{
    const arrayChi = ["Sửu", "Tý", "Hợi", "Hợi", "Sửu", "Tý", "Ngọ", "Ngọ", "Mão", "Mão"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Khôi<br>";
}

function saoThienViet(tenCan)
{
    const arrayChi = ["Mùi", "Thân", "Dậu", "Dần", "Mùi", "Thân", "Dần", "Dần", "Tỵ", "Tỵ"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Việt<br>";
}

function saoThienQuan(tenCan)
{
    const arrayChi = ["Mùi", "Thìn", "Tỵ", "Dần", "Mão", "Dậu", "Hợi", "Dậu", "Tuất", "Ngọ"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Quan<br>";
}

function saoThienPhuc(tenCan)
{
    const arrayChi = ["Dậu", "Thân", "Tý", "Hợi", "Mão", "Dần", "Ngọ", "Tỵ", "Ngọ", "Tỵ"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Phúc<br>";
}

function saoQuocAn(tenCan)
{
    const arrayChi = ["Tuất", "Hợi", "Sửu", "Dần", "Sửu", "Dần", "Thìn", "Tỵ", "Mùi", "Thân"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Quốc Ấn<br>";
}

function saoDuongPhu(tenCan)
{
    const arrayChi = ["Mùi", "Thân", "Tuất", "Hợi", "Tuất", "Hợi", "Sửu", "Dần", "Thìn", "Tỵ"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Đường Phù<br>";
}

function saoLuuHa(tenCan)
{
    const arrayChi = ["Dậu", "Tuất", "Mùi", "Thìn", "Tỵ", "Ngọ", "Thân", "Mão", "Hợi", "Dần"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Lưu Hà<br>";
}

function saoThienTru(tenCan)
{
    const arrayChi = ["Tỵ", "Ngọ", "Tý", "Tỵ", "Ngọ", "Thân", "Dần", "Ngọ", "Dậu", "Tuất"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Trù<br>";
}

function saoHoaLoc(tenCan)
{
    const arrayTuVi = ["Liêm Trinh", "Thiên Cơ", "Thiên Đồng", "Thái Âm", "Tham Lang", "Vũ Khúc", "Thái Dương", "Cự Môn", "Thiên Lương", "Phá Quân"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Lộc<br>";
            break;
        }
    }
}

function saoHoaQuyen(tenCan)
{
    const arrayTuVi = ["Phá Quân", "Thiên Lương", "Thiên Cơ", "Thiên Đồng", "Thái Âm", "Tham Lang", "Vũ Khúc", "Thái Dương", "Tử Vi", "Cự Môn"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Quyền<br>";
            break;
        }
    }
}


function saoHoaKhoi(tenCan)
{
    const arrayTuVi = ["Vũ Khúc", "Tử Vi", "Văn Xương", "Thiên Cơ", "Hữu Bật", "Thiên Lương", "Thái Âm", "Văn Khúc", "Tả Phụ", "Thái Âm"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Khôi<br>";
            break;
        }
        let idAnSaoKhac = "SaoKhac" + (i+1);
        let datak = document.getElementById(idAnSaoKhac).innerHTML;
        if(datak.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Khôi<br>";
            break;
        }
    }
}

function saoHoaKy(tenCan)
{
    const arrayTuVi = ["Thái Dương", "Thái Âm", "Liêm Trinh", "Cự Môn", "Thiên Cơ", "Văn Khúc", "Thiên Đồng", "Văn Xương", "Vũ Khúc", "Tham Lang"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Kỵ<br>";
            break;
        }
        let idAnSaoKhac = "SaoKhac" + (i+1);
        let datak = document.getElementById(idAnSaoKhac).innerHTML;
        if(datak.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hóa Kỵ<br>";
            break;
        }
    }
}

function anSaoTheoCan(tenCan)
{
    saoThienKhoi(tenCan);
    saoThienViet(tenCan);
    saoThienQuan(tenCan);
    saoThienPhuc(tenCan);
    saoQuocAn(tenCan);
    saoDuongPhu(tenCan);
    saoLuuHa(tenCan);
    saoThienTru(tenCan);
    saoHoaLoc(tenCan);
    saoHoaQuyen(tenCan);
    saoHoaKhoi(tenCan);
    saoHoaKy(tenCan);
}

function saoLongTri(tenChi)
{
    const arrayChi = ["Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Long Trì<br>";
}

function saoPhuongCac(tenChi)
{
    const arrayChi = ["Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Phượng Các<br>";
}

function saoGiaiThan(tenChi)
{
    const arrayChi = ["Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Giải Thần<br>";
}

function saoThienKhoc(tenChi)
{
    const arrayChi = ["Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi", "Tuất", "Dậu", "Thân", "Mùi"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Khốc<br>";
}

function saoThienHu(tenChi)
{
    const arrayChi = ["Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Hư<br>";
}

function saoThienDuc(tenChi)
{
    const arrayChi = ["Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Đức<br>";
}

function saoNguyetDuc(tenChi)
{
    const arrayChi = ["Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Nguyệt Đức<br>";
}

function saoHongLoan(tenChi)
{
    const arrayChi = ["Mão", "Dần", "Sửu", "Tý", "Hợi", "Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Hồng Loan<br>";
}

function saoThienHy(tenChi)
{
    const arrayChi = ["Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi", "Tuất"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Hỷ<br>";
}

function saoCoThan(tenChi)
{
    const arrayChi = ["Dần", "Dần", "Tỵ", "Tỵ", "Tỵ", "Thân", "Thân", "Thân", "Hợi", "Hợi", "Hợi", "Dần"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Cô Thần<br>";
}

function saoQuaTu(tenChi)
{
    const arrayChi = ["Tuất", "Tuất", "Sửu", "Sửu", "Sửu", "Thìn", "Thìn", "Thìn", "Mùi", "Mùi", "Mùi", "Tuất"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Quả Tú<br>";
}

function saoDaoHoa(tenChi)
{
    const arrayChi = ["Dậu", "Ngọ", "Mão", "Tý", "Dậu", "Ngọ", "Mão", "Tý", "Dậu", "Ngọ", "Mão", "Tý"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Đào Hoa<br>";
}

function saoThienMa(tenChi)
{
    const arrayChi = ["Dần", "Hợi", "Thân", "Tỵ", "Dần", "Hợi", "Thân", "Tỵ", "Dần", "Hợi", "Thân", "Tỵ"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Mã<br>";
}

function saoKiepSat(tenChi)
{
    const arrayChi = ["Tỵ", "Dần", "Hợi", "Thân", "Tỵ", "Dần", "Hợi", "Thân", "Tỵ", "Dần", "Hợi", "Thân"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Kiếp Sát<br>";
}

function saoHoaCai(tenChi)
{
    const arrayChi = ["Thìn", "Sửu", "Tuất", "Mùi", "Thìn", "Sửu", "Tuất", "Mùi", "Thìn", "Sửu", "Tuất", "Mùi"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Hoa Cái<br>";
}

function saoPhaToai(tenChi)
{
    const arrayChi = ["Tỵ", "Sửu", "Dậu", "Tỵ", "Sửu", "Dậu", "Tỵ", "Sửu", "Dậu", "Tỵ", "Sửu", "Dậu"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Phá Toái<br>";
}

function saoThienKhong(tenChi)
{
    const arrayChi = ["Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Không<br>";
}

function anSaoTheoChi(tenChi)
{
    saoLongTri(tenChi);
    saoPhuongCac(tenChi);
    saoGiaiThan(tenChi);
    saoThienKhoc(tenChi);
    saoThienHu(tenChi);
    saoThienDuc(tenChi);
    saoNguyetDuc(tenChi);
    saoHongLoan(tenChi);
    saoThienHy(tenChi);
    saoCoThan(tenChi);
    saoQuaTu(tenChi);
    saoDaoHoa(tenChi);
    saoThienMa(tenChi);
    saoKiepSat(tenChi);
    saoHoaCai(tenChi);
    saoPhaToai(tenChi);
    saoThienKhong(tenChi);
    saoThienTai(tenChi);
    saoThienTho(tenChi);
}

function saoTaPhu(tenThang)
{
    const arrayChi = ["Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Tả Phù<br>";

}

function saoHuuBat(tenThang)
{
    const arrayChi = ["Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Hữu Bật<br>";

}

function saoThienHinh(tenThang)
{
    const arrayChi = ["Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Hình<br>";

}

function saoThienRieu(tenThang)
{
    const arrayChi = ["Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Riêu<br>";

}

function saoThienY(tenThang)
{
    const arrayChi = ["Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Y<br>";

}

function saoThienGiai(tenThang)
{
    const arrayChi = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];
    const tempChi= arrayChi[tenThang -1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Giải<br>";

}

function saoDiaGiai(tenThang)
{
    const arrayChi = ["Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ"];
    const tempChi= arrayChi[tenThang -1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Địa Giải<br>";

}

function anSaoTheoThang(tenThang)
{
    saoTaPhu(tenThang);
    saoHuuBat(tenThang);
    saoThienHinh(tenThang);
    saoThienRieu(tenThang);
    saoThienY(tenThang);
    saoThienGiai(tenThang);
    saoDiaGiai(tenThang);
}

function saoVanXuong(tenGio)
{
    const arrayChi = ["Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý", "Hợi"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Văn Xương<br>";
}

function saoVanKhuc(tenGio)
{
    const arrayChi = ["Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Văn Khúc<br>";
}

function saoThaiPhu(tenGio)
{
    const arrayChi = ["Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thai Phụ<br>";
}

function saoPhongCao(tenGio)
{
    const arrayChi = ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Phong Cáo<br>";
}

function saoDiaKhong(tenGio)
{
    const arrayChi = ["Hợi", "Tuất", "Dậu", "Thân", "Mùi", "Ngọ", "Tỵ", "Thìn", "Mão", "Dần", "Sửu", "Tý"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Địa Không<br>";
}

function saoDiaKiep(tenGio)
{
    const arrayChi = ["Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Địa Kiếp<br>";
}

function saoHoaLinh(tenChi, tenGio, NamOrNu)
{
    let hoa, linh;
    switch(tenChi)
    {
        case "Dần":
        case "Ngọ":
        case "Tuất":
            hoa = ChieuThuan.indexOf("Sửu");
            linh = ChieuThuan.indexOf("Mão");
        break;
        case "Thân":
        case "Tý":
        case "Thìn":
            hoa = ChieuThuan.indexOf("Dần");
            linh = ChieuThuan.indexOf("Tuất");
        break; 
        case "Tỵ":
        case "Dậu":
        case "Sửu":
            hoa = ChieuThuan.indexOf("Mão");
            linh = ChieuThuan.indexOf("Tuất");
        break;
        case "Hợi":
        case "Mão":
        case "Mùi":
            hoa = ChieuThuan.indexOf("Dậu");
            linh = ChieuThuan.indexOf("Tuất");
        break;
    }

    if(NamOrNu == "Nam")
    {
        if(ViTriMenh%2 === 1) //Âm Nam
        {
            console.log("Âm Nam" + hoa);
            hoa = hoa - DiaChi.indexOf(tenGio);
            if(hoa < 0) hoa = hoa +12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hỏa Tinh<br>";
            
            linh = linh + DiaChi.indexOf(tenGio);
            if(linh > 11) linh = linh -12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
        else //Dương Nam
        {
            console.log("Dương Nam");
            hoa = hoa + DiaChi.indexOf(tenGio);
            if(hoa > 11) hoa = hoa -12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hỏa Tinh<br>";
            
            linh = linh - DiaChi.indexOf(tenGio);
            if(linh < 0) linh = linh +12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
    }
    else if(NamOrNu == "Nữ")
    {
        if(ViTriMenh%2 === 1) //Âm Nữ
        {
            console.log("Âm Nữ");
            hoa = hoa + DiaChi.indexOf(tenGio);
            if(hoa > 11) hoa = hoa -12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hỏa Tinh<br>";
            
            linh = linh - DiaChi.indexOf(tenGio);
            if(linh < 0) linh = linh +12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
        else //Dương nữ
        {
            console.log("Dương Nữ");
            hoa = hoa - DiaChi.indexOf(tenGio);
            if(hoa < 0) hoa = hoa +12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Hỏa Tinh<br>";
            
            linh = linh + DiaChi.indexOf(tenGio);
            if(linh > 11) linh = linh -12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
    }
}

function anSaoTheoGio(tenGio)
{
    saoVanXuong(tenGio);
    saoVanKhuc(tenGio);
    saoThaiPhu(tenGio);
    saoPhongCao(tenGio);
    saoDiaKhong(tenGio);
    saoDiaKiep(tenGio);
}

function anTuanTriet(tenCan, tenChi)
{
    let retTuan;
    let indexCan = ThienCan.indexOf(tenCan);
    let indexChi = DiaChi.indexOf(tenChi);
    let a = indexChi - indexCan;
    if(a < 0) a = a +12;
    switch(a)
    {
        case 0: retTuan = "Tuất - Hợi";
        break;
        case 10: retTuan = "Thân - Dậu";
        break;
        case 8: retTuan = "Ngọ - Mùi";
        break;
        case 6: retTuan = "Thìn - Tỵ";
        break;
        case 4: retTuan = "Dần - Mão";
        break;
        case 2: retTuan = "Tý - Sửu";
        break;
    }
    let retTriet;
    switch(indexCan)
    {
        case 5:
        case 0: retTriet = "Thân - Dậu";
        break;
        case 6:
        case 1: retTriet = "Ngọ - Mùi";
        break;
        case 7:
        case 2: retTriet = "Thìn - Tỵ";
        break;
        case 8:
        case 3: retTriet = "Dần - Mão";
        break;
        case 9:
        case 4: retTriet = "Tý - Sửu";
        break;
    }
    
    document.getElementById("TuanTriet").innerHTML = "Tuần tại: " + retTuan + "<br><br>Triệt tại: " + retTriet;
}

function saoDauQuan(tenThang, tenGio)
{
    let thaiTue;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnThaiTue" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Thái Tuế") !== -1)
        {
            thaiTue = i;
            break;
        }
    }
    let a = thaiTue - tenThang;
    if(a < 0) a = a + 12;
    let b = a + DiaChi.indexOf(tenGio) + 1;
    if(b > 11) b = b -12;
    let idThienKhoi = "SaoKhac" + (b + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Đẩu Quân<br>";
        
}

function saoThienTai(tenChi)
{
    let a = ViTriMenh + DiaChi.indexOf(tenChi);
    if(a > 11) a = a -12;
    let idThienKhoi = "SaoKhac" + (a + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Tài<br>";
        
}

function saoThienTho(tenChi)
{
    let a = viTriThan + DiaChi.indexOf(tenChi);
    if(a > 11) a = a -12;
    let idThienKhoi = "SaoKhac" + (a + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Thọ<br>";
        
}

function saoAnQuang(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Văn Xương") !== -1)
        {
            index = i;
            break;
        }
    }
    let a = index + tenNgay%12 -1;
    if(a > 11) a = a -12;
    let b = a -1;
    let idThienKhoi = "SaoKhac" + (b + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Ân Quang<br>";
}

function saoThienQuy(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Văn Khúc") !== -1)
        {
            index = i;
            break;
        }
    }
    let a = index - tenNgay%12;
    if(a < 0) a = a +12;
    let b = a + 2;
    if(b > 11) b = b - 12;
    let idThienKhoi = "SaoKhac" + (b+1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Quý<br>";
}

function saoTamTai(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Tả Phù") !== -1)
        {
            index = i;
            break;
        }
    }

    let a = index + tenNgay%12 -1;
    if(a > 11) a = a - 12;
    let idThienKhoi = "SaoKhac" + (a+1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Tam Tai<br>";
}

function saoBatToa(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Hữu Bật") !== -1)
        {
            index = i;
            break;
        }
    }

    let a = index - tenNgay%12 + 1;
    if(a < 0) a = a + 12;
    let idThienKhoi = "SaoKhac" + (a+1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Bát Tọa<br>";
}

function anSaoCoDinh()
{
    let temp = document.getElementById("SaoKhac3").innerHTML;
    document.getElementById("SaoKhac3").innerHTML = temp + " Thiên La<br>";

    temp = document.getElementById("SaoKhac9").innerHTML;
    document.getElementById("SaoKhac9").innerHTML = temp + " Địa Võng<br>";

    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "CungMenh" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("NÔ BỘC") !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Thương<br>";
        }
        if(data.indexOf("TẬT ÁCH") !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Thiên Sứ<br>";
        }
    }

}