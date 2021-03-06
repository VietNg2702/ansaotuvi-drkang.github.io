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
    ["T??? Vi, Thi??n Ph???", "Th??i ??m", "Tham Lang", "C??? M??n", "Li??m Trinh, Thi??n T?????ng", "Thi??n L????ng", "Th???t S??t", "Thi??n ?????ng", "V?? Kh??c", "Th??i D????ng","Ph?? Qu??n", "Thi??n C??"],
    ["Thi??n C??, Th??i ??m", "T??? Vi, Tham Lang", "C??? M??n", "Thi??n T?????ng", "Thi??n L????ng", "Li??m Trinh, Th???t S??t", " ", " ", "Thi??n ?????ng", "V?? Kh??c, Ph?? Qu??n", "Th??i D????ng", "Thi??n Ph???"],
    ["Tham Lang", "C??? M??n, Thi??n C??", "T??? Vi, Thi??n T?????ng", "Thi??n L????ng", "Th???t S??t", " ", "Li??m Trinh", " ", "Ph?? Qu??n", "Thi??n ?????ng", "V?? Kh??c, Thi??n Ph???", "Th??i D????ng, Th??i ??m"],
    ["Th??i D????ng, C??? M??n", "Thi??n T?????ng", "Thi??n C??, Thi??n L????ng", "T??? Vi, Th???t S??t", " ", " ", " ", "Li??m Trinh, Ph?? Qu??n", " ", "Thi??n Ph???", "Thi??n ?????ng, Th??i ??m", "V?? Kh??c, Tham Lang"],
    ["V?? Kh??c, Thi??n T?????ng", "Th??i D????ng, Thi??n L????ng", "Th???t S??t", "Thi??n C??", "T??? Vi", " ", "Ph?? Qu??n", " ", "Li??m Trinh, Thi??n Ph???", "Th??i ??m", "Tham Lang", "Thi??n ?????ng, C??? M??n"],
    ["Thi??n ?????ng, Thi??n L????ng", "V?? Kh??c, Th???t S??t", "Th??i D????ng", " ", "Thi??n C??", "T??? Vi, Ph?? Qu??n", " ", "Thi??n Ph???", "Th??i ??m", "Li??m Trinh, Tham Lang", "C??? M??n", "Thi??n T?????ng"],
    ["Th???t S??t", "Thi??n ?????ng", "V?? Kh??c", "Th??i D????ng", "Ph?? Qu??n", "Thi??n C??", "T??? Vi, Thi??n Ph???", "Th??i ??m", "Tham Lang", "C??? M??n", "Li??m Trinh, Thi??n T?????ng", "Thi??n L????ng"],
    [" ", " ", "Thi??n ?????ng", "V?? Kh??c, Ph?? Qu??n", "Th??i D????ng", "Thi??n Ph???", "Thi??n C??, Th??i ??m", "T??? Vi, Tham Lang", "C??? M??n", "Thi??n T?????ng", "Thi??n L????ng", "Li??m Trinh, Th???t S??t"],
    ["Li??m Trinh", " ", "Ph?? Qu??n", "Thi??n ?????ng", "V?? Kh??c, Thi??n Ph???", "Th??i D????ng, Th??i ??m", "Tham Lang", "Thi??n C??, C??? M??n", "T??? Vi, Thi??n T?????ng", "Thi??n L????ng", "Th???t S??t", " "],
    [" ", "Li??m Trinh, Ph?? Qu??n", " ", "Thi??n Ph???", "Thi??n ?????ng, Th??i ??m", "V?? Kh??c, Tham Lang", "Th??i D????ng, C??? M??n", "Thi??n T?????ng", "Thi??n C??, Thi??n L????ng", "T??? Vi, Th???t S??t", " ", " "],
    ["Ph?? Qu??n", " ", "Li??m Trinh, Thi??n Ph???", "Th??i ??m", "Tham Lang", "Thi??n ?????ng, C??? M??n", "V?? Kh??c, Thi??n T?????ng", "Th??i D????ng, Thi??n L????ng", "Th???t S??t", "Thi??n C??", "T??? Vi", " "],
    [" ", "Thi??n Ph???", "Th??i ??m", "Li??m Trinh, Tham Lang", "C??? M??n", "Thi??n T?????ng", "Thi??n ?????ng, Thi??n L????ng", "V?? Kh??c, Th???t S??t", "Th??i D????ng", " ", "Thi??n C??", "T??? Vi, Ph?? Qu??n"]
    ]
const ChieuThuan = ["D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u"];
const AnTrangSinh = ["Tr??ng sinh", "D?????ng", "Thai", "Tuy???t", "M???", "T???", "B???nh", "Suy", "????? V?????ng", "L??m Quan", "Quan ?????i", "M???c D???c"];
const AnThaiTue = ["Th??i Tu???", "Thi???u D????ng", "Tang M??n", "Thi???u ??m", "Quan Ph??", "T??? Ph??", "Tu??? Ph??", "Long ?????c", "B???ch H???", "Ph??c ?????c", "??i???u Kh??ch", "Tr???c Ph??"];
const AnLocTon = [ "L???c T???n, B??c S???", "L???c S???", "Thanh Long", "Ti???u Hao", "T?????ng Qu??n", "T???u Th??", "Phi Li??m", "H??? Th???n", "B???nh Ph??", "?????i Hao", "Ph???c Binh", "Quan Ph???"];
const idDaiVan = ["DaiVan1","DaiVan2","DaiVan3","DaiVan4","DaiVan5","DaiVan6","DaiVan7","DaiVan8","DaiVan9","DaiVan10","DaiVan11","DaiVan12"];
const idTieuVan = ["TieuVan1","TieuVan2","TieuVan3","TieuVan4","TieuVan5","TieuVan6","TieuVan7","TieuVan8","TieuVan9","TieuVan10","TieuVan11","TieuVan12"];
const CungDiaBan = ["D???n M???c +", "M??o M???c -", "Th??n Th??? +", "T??? H???a -", "Ng??? H???a +", "M??i Th??? -", "Th??n Kim +", "D???u Kim -", "Tu???t Th??? +", "H???i Th???y -", "T?? Th???y +", "S???u Th??? -"];
const CungMenh = ["M???NH VI??N", "PH??? M???U", "PH??C ?????C", "??I???N TR???CH", "QUAN L???C", "N?? B???C", "THI??N DI", "T???T ??CH", "T??I B???CH", "T??? T???C", "PHU TH??", "HUYNH ?????"];
const ThienCan = ["Gi??p", "???t", "B??nh", "??inh", "M???u", "K???", "Canh", "T??n", "Nh??m", "Qu??"];
const DiaChi = ["T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i"];
const Cuc = ["Th???y Nh??? C???c", "M???c Tam C???c", "Kim T??? C???c", "Th??? Ng?? C???c", "H???a L???c C???c"];
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

//T???i Cung ?????a B??n
for (let i = 0; i < 12; i++) {
    let id = "CungDiaBan" + (i + 1);
    document.getElementById(id).innerHTML = CungDiaBan[i].toString();
}

//T???i Thi??n B??n
document.getElementById("hovaten").innerHTML = HovaTen;
document.getElementById("ngaysinh").innerHTML = "??m l???ch: Gi??? " + GioSinh + " " + NgaySinh + "-" + ThangSinh + " " + tinhCanSinh(NamSinh) + " " + tinhChiSinh(NamSinh);

localStorage.removeItem("lich");
localStorage.removeItem("hovaten");
localStorage.removeItem("giosinh");
localStorage.removeItem("ngaysinh");
localStorage.removeItem("thangsinh");
localStorage.removeItem("namsinh");
localStorage.removeItem("gioitinh");

//?????nh Cung M???ng, Th??n, v?? c??c Cung kh??c
var x = DiaChi.indexOf(GioSinh) + 1;

dinhCungMangThan(parseInt(x), parseInt(ThangSinh));

//?????nh C???c
var cuc = dinhCuc(CanSinh, ChiSinh);

//T??m B???n M???nh
document.getElementById("BanMenh").innerHTML = timBanMenh(CanSinh, ChiSinh);

//T??nh ?????i v???n, Ti???u V???n
tinhDaiTieu(GioiTinh, ChiSinh, cuc);

//An T??? Vi
anTuVi(cuc, parseInt(NgaySinh));

//An Tr??ng Sinh
anTrangSinh(cuc, GioiTinh);

//An Th??i Tu???
anThaiTue(ChiSinh);

//An L???c T???n
anLocTon(CanSinh, GioiTinh);

//An Sao theo Thi??n Can
anSaoTheoCan(CanSinh);

//An Sao theo ?????a Chi
anSaoTheoChi(ChiSinh);

//An Sao theo Th??ng Sinh
anSaoTheoThang(parseInt(ThangSinh));

//An Sao theo Gi??? Sinh
anSaoTheoGio(GioSinh);

//An Tu???n Tri???t
anTuanTriet(CanSinh, ChiSinh);

//An Sao C??? ?????nh
anSaoCoDinh();

//An Sao ?????u Qu??n
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
    //?????nh Cung Th??n
    viTriThan = thangSinh + gioSinh - 2;
    if(viTriThan > 11) viTriThan = viTriThan -12;
    
    //?????nh Cung M???nh
    if(thangSinh == gioSinh) ViTriMenh = 0;
    else if(thangSinh > gioSinh) ViTriMenh = (thangSinh - gioSinh);
    else if(thangSinh < gioSinh) ViTriMenh = (12 + thangSinh - gioSinh);
    //T???i Cung M???nh
    for(let i = 0; i < 12 ; i++)
    {
        let index = i + ViTriMenh;
        if(index > 11) index = index - 12;
        
        let id = "CungMenh" + (index + 1);
        document.getElementById(id).innerHTML = CungMenh[i].toString();
        if(index == viTriThan)
        {
            document.getElementById("CungThan").innerHTML = "Th??n t???i: " + CungMenh[i].toString();
        }
    }
}

function dinhCuc(Can, Chi)
{
    switch(Chi)
    {
        case "T??":
        case "S???u":
        {
            switch(Can)
            {
                case "Gi??p":
                case "K???":
                {
                    document.getElementById("Cuc").innerHTML = "Th???y Nh??? C???c";
                    return "Th???y Nh??? C???c";
                }break;
                case "???t":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "H???a L???c C???c";
                    return "H???a L???c C???c";
                }break;
                case "B??nh":
                case "T??n":
                {
                    document.getElementById("Cuc").innerHTML = "Th??? Ng?? C???c";
                    return "Th??? Ng?? C???c";
                }break;
                case "??inh":
                case "Nh??m":
                {
                    document.getElementById("Cuc").innerHTML = "M???c Tam C???c";
                    return "M???c Tam C???c";
                }break;
                case "M???u":
                case "Qu??":
                {
                    document.getElementById("Cuc").innerHTML = "Kim T??? C???c";
                    return "Kim T??? C???c";
                }break;
            }
        }break;
        case "D???n":
        case "M??o":
        case "Tu???t":
        case "H???i":
        {
            switch(Can)
            {
                case "Gi??p":
                case "K???":
                {
                    document.getElementById("Cuc").innerHTML = "H???a L???c C???c";
                    return "H???a L???c C???c";
                }break;
                case "???t":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Th??? Ng?? C???c";
                    return "Th??? Ng?? C???c";
                }break;
                case "B??nh":
                case "T??n":
                {
                    document.getElementById("Cuc").innerHTML = "M???c Tam C???c";
                    return "M???c Tam C???c";
                }break;
                case "??inh":
                case "Nh??m":
                {
                    document.getElementById("Cuc").innerHTML = "Kim T??? C???c";
                    return "Kim T??? C???c";
                }break;
                case "M???u":
                case "Qu??":
                {
                    document.getElementById("Cuc").innerHTML = "Th???y Nh??? C???c";
                    return "Th???y Nh??? C???c";
                }break;
            }
        }break;
        case "Th??n":
        case "T???":
        {
            switch(Can)
            {
                case "Gi??p":
                case "K???":
                {
                    document.getElementById("Cuc").innerHTML = "M???c Tam C???c";
                    return "M???c Tam C???c";
                }break;
                case "???t":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Kim T??? C???c";
                    return "Kim T??? C???c";
                }break;
                case "B??nh":
                case "T??n":
                {
                    document.getElementById("Cuc").innerHTML = "Th???y Nh??? C???c";
                    return "Th???y Nh??? C???c";
                }break;
                case "??inh":
                case "Nh??m":
                {
                    document.getElementById("Cuc").innerHTML = "H???a L???c C???c";
                    return "H???a L???c C???c";
                }break;
                case "M???u":
                case "Qu??":
                {
                    document.getElementById("Cuc").innerHTML = "Th??? Ng?? C???c";
                    return "Th??? Ng?? C???c";
                }break;
            }
        }break;
        case "Ng???":
        case "M??i":
        {
            switch(Can)
            {
                case "Gi??p":
                case "K???":
                {
                    document.getElementById("Cuc").innerHTML = "Th??? Ng?? C???c";
                    return "Th??? Ng?? C???c";
                }break;
                case "???t":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "M???c Tam C???c";
                    return "M???c Tam C???c";
                }break;
                case "B??nh":
                case "T??n":
                {
                    document.getElementById("Cuc").innerHTML = "Kim T??? C???c";
                    return "Kim T??? C???c";
                }break;
                case "??inh":
                case "Nh??m":
                {
                    document.getElementById("Cuc").innerHTML = "Th???y Nh??? C???c";
                    return "Th???y Nh??? C???c";
                }break;
                case "M???u":
                case "Qu??":
                {
                    document.getElementById("Cuc").innerHTML = "H???a L???c C???c";
                    return "H???a L???c C???c";
                }break;
            }
        }break;
        case "Th??n":
        case "D???u":
        {
            switch(Can)
            {
                case "Gi??p":
                case "K???":
                {
                    document.getElementById("Cuc").innerHTML = "Kim T??? C???c";
                    return "Kim T??? C???c";
                }break;
                case "???t":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Th???y Nh??? C???c";
                    return "Th???y Nh??? C???c";
                }break;
                case "B??nh":
                case "T??n":
                {
                    document.getElementById("Cuc").innerHTML = "H???a L???c C???c";
                    return "H???a L???c C???c";
                }break;
                case "??inh":
                case "Nh??m":
                {
                    document.getElementById("Cuc").innerHTML = "Th??? Ng?? C???c";
                    return "Th??? Ng?? C???c";
                }break;
                case "M???u":
                case "Qu??":
                {
                    document.getElementById("Cuc").innerHTML = "M???c Tam C???c";
                    return "M???c Tam C???c";
                }break;
            }
        }break;
    }
}

function timBanMenh(Can, Chi)
{
    switch(Can + ' ' + Chi)
    {
        case "Gi??p T??":
        case "???t S???u": 
        return "H???i trung kim (v??ng ????y bi???n)";
        case "B??nh D???n": 
        case "??inh M??o": 
        return "L?? trung H???a (l???a trong l??);"
        case "M???u Th??n": 
        case "K??? M??o": 
        return "?????i l??m m???c (c??y ??? trong r???ng)";
        case "Canh Ng???": 
        case "T??n M??i": 
        return "L??? b??ng th??? (?????t b??n ???????ng)";
        case "Nh??m Th??n": 
        case "Qu?? D???u": 
        return "Ki???m phong kim (v??ng ?????y g????m)";
        case "Gi??p Tu???t": 
        case "???t H???i": 
        return "S??n ?????u h???a (l???a ?????u n??i)";
        case "B??nh T??": 
        case "??inh S???u": 
        return "Gi???n h??? th???y (n?????c khe su???i)";
        case "M???u D???n": 
        case "K??? M??o": 
        return "Th??nh ?????u th??? (?????t ?????u th??nh)";
        case "Canh Th??n": 
        case "T??n T???": 
        return "B???ch l???p kim (????n n???n tr???ng)";
        case "Nh??m Ng???": 
        case "Qu?? M??i":  
        return "D????ng li???u m???c (c??y d????ng li???u)";
        case "Gi??p Th??n": 
        case "???t D???u":
        return "Tuy???n trung th???y (n?????c gi???a su???i)";
        case "B??nh Tu???t":
        case "??inh H???i" : 
        return "???c th?????ng th??? (?????t m??i nh??);"
        case "M???u T??": 
        case "K??? S???u": 
        return "T??ch l???ch h???a (l???a s???m s??t)";
        case "Canh D???n": 
        case "T??n M??o": 
        return "T??ng b??ch m???c (c??y t??ng b??ch)";
        case "Nh??m Th??n": 
        case "Qu?? T???":  
        return "Tr??ng l??u th???y (n?????c d??ng s??ng)";
        case "Gi??p Ng???": 
        case "???t M??i" : 
        return "Sa trung kim (v??ng trong c??t)";
        case "B??nh Th??n": 
        case "??inh D???u" : 
        return "S??n h??? h???a (l???a d?????i c??t)";
        case "M???u Tu???t": 
        case "K??? H???i": 
        return "B??nh ?????a m???c (c??y ?????ng b???ng)";
        case "Canh T??": 
        case "T??n S???u": 
        return "B???ch th?????ng th??? (?????t tr??n v??ch);"
        case "Nh??m D???n": 
        case "Qu?? M??o": 
        return "Kim b???ch kim (v??ng b???ch kim)";
        case "Gi??p Th??n": 
        case "???t T???": 
        return "Ph?? ????ng h???a (l???a ng???n ????n l???n)";
        case "B??nh Ng???": 
        case "??inh M??i": 
        return "Thi??n th?????ng th???y (n?????c tr??n tr???i)";
        case "M???u Th??n": 
        case "K??? D???u": 
        return "?????t trach th??? (?????t l??m nh??)";
        case "Canh Tu???t": 
        case "T??n H???i": 
        return "Xuy???n thoa kim (v??ng trong tay)";
        case "Nh??m T??": 
        case "Qu?? S???u": 
        return "Tang kh?? m???c (g??? c??y d??u)";
        case "Gi??p D???n": 
        case "???t M??o": 
        return "?????i kh?? th???y (n?????c su???i l???n)";
        case "B??nh Th??n": 
        case "??inh T???": 
        return "Sa trung th??? (?????t gi???a c??t)";
        case "M???u Ng???": 
        case "K??? M??i": 
        return "Thi??n th?????ng h???a (l???a tr??n tr???i)";
        case "Canh Th??n": 
        case "T??n D???u": 
        return "Th???ch l???u m???c (c??y th???ch l???u)";
        case "Nh??m Tu???t": 
        case "Qu?? H???i": 
        return "?????i h???i thu??? (n?????c bi???n l???n)";
    }
}

function tinhDaiTieu(NamOrNu, Chi, tenCuc)
{
    var index;
    switch(Chi)
    {
        case "D???n":
        case "Ng???":
        case "Tu???t":
        {
            index = 2;
        }break;
        case "T???":
        case "D???u":
        case "S???u":
        {
            index = 5;
        }break;
        case "Th??n":
        case "T??":
        case "Th??n":
        {
            index = 8;
        }break;
        case "H???i":
        case "M??o":
        case "M??i":
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

        if(ViTriMenh%2 === 1) //Nam D????ng
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh - i;
                if(j < 0) j = j + 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //Nam ??m
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
    }
    else if(NamOrNu == "N???")
    {
        for(let i = 0; i < 12; i++)
        {
            let j = i + index;
            let k = DiaChi.indexOf(Chi) - i;
            if(j > 11) j = j - 12;
            if(k < 0) k = k + 12;
            document.getElementById(idDaiVan[j].toString()).innerHTML = DiaChi[k].toString();
        }
        if(ViTriMenh%2 === 1) //N??? ??m
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //N??? D????ng
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
            index = 6; //Th??n
            break;
        case Cuc[1]:
            index = 9; //H???i
            break;
        case Cuc[2]:
            index = 3; //T???
            break;
        case Cuc[3]:
            index = 6; //Th??n
            break;
        case Cuc[4]:
            index = 0; //D???n
            break;
    }
    if(NamOrNu === "Nam")
    {
        if(ViTriMenh%2 === 1) //D????ng Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //??m Nam
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
    else if(NamOrNu === "N???")
    {
        if(ViTriMenh%2 === 1) //??m n???
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //D????ng N???
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
        if(ViTriMenh%2 === 0) //D????ng Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //??m Nam
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
    else if(NamOrNu === "N???")
    {
        if(ViTriMenh%2 === 0) //??m n???
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //D????ng N???
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
    document.getElementById(idDaLa).innerHTML = "???? La <br>";
    document.getElementById(idKinhDuong).innerHTML = "K??nh D????ng<br>";
    
}

function saoThienKhoi(tenCan)
{
    const arrayChi = ["S???u", "T??", "H???i", "H???i", "S???u", "T??", "Ng???", "Ng???", "M??o", "M??o"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Kh??i<br>";
}

function saoThienViet(tenCan)
{
    const arrayChi = ["M??i", "Th??n", "D???u", "D???n", "M??i", "Th??n", "D???n", "D???n", "T???", "T???"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Vi???t<br>";
}

function saoThienQuan(tenCan)
{
    const arrayChi = ["M??i", "Th??n", "T???", "D???n", "M??o", "D???u", "H???i", "D???u", "Tu???t", "Ng???"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Quan<br>";
}

function saoThienPhuc(tenCan)
{
    const arrayChi = ["D???u", "Th??n", "T??", "H???i", "M??o", "D???n", "Ng???", "T???", "Ng???", "T???"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Ph??c<br>";
}

function saoQuocAn(tenCan)
{
    const arrayChi = ["Tu???t", "H???i", "S???u", "D???n", "S???u", "D???n", "Th??n", "T???", "M??i", "Th??n"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Qu???c ???n<br>";
}

function saoDuongPhu(tenCan)
{
    const arrayChi = ["M??i", "Th??n", "Tu???t", "H???i", "Tu???t", "H???i", "S???u", "D???n", "Th??n", "T???"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " ???????ng Ph??<br>";
}

function saoLuuHa(tenCan)
{
    const arrayChi = ["D???u", "Tu???t", "M??i", "Th??n", "T???", "Ng???", "Th??n", "M??o", "H???i", "D???n"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " L??u H??<br>";
}

function saoThienTru(tenCan)
{
    const arrayChi = ["T???", "Ng???", "T??", "T???", "Ng???", "Th??n", "D???n", "Ng???", "D???u", "Tu???t"];
    const tenChi= arrayChi[ThienCan.indexOf(tenCan)];
    const index = ChieuThuan.indexOf(tenChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Tr??<br>";
}

function saoHoaLoc(tenCan)
{
    const arrayTuVi = ["Li??m Trinh", "Thi??n C??", "Thi??n ?????ng", "Th??i ??m", "Tham Lang", "V?? Kh??c", "Th??i D????ng", "C??? M??n", "Thi??n L????ng", "Ph?? Qu??n"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a L???c<br>";
            break;
        }
    }
}

function saoHoaQuyen(tenCan)
{
    const arrayTuVi = ["Ph?? Qu??n", "Thi??n L????ng", "Thi??n C??", "Thi??n ?????ng", "Th??i ??m", "Tham Lang", "V?? Kh??c", "Th??i D????ng", "T??? Vi", "C??? M??n"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a Quy???n<br>";
            break;
        }
    }
}


function saoHoaKhoi(tenCan)
{
    const arrayTuVi = ["V?? Kh??c", "T??? Vi", "V??n X????ng", "Thi??n C??", "H???u B???t", "Thi??n L????ng", "Th??i ??m", "V??n Kh??c", "T??? Ph???", "Th??i ??m"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a Kh??i<br>";
            break;
        }
        let idAnSaoKhac = "SaoKhac" + (i+1);
        let datak = document.getElementById(idAnSaoKhac).innerHTML;
        if(datak.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a Kh??i<br>";
            break;
        }
    }
}

function saoHoaKy(tenCan)
{
    const arrayTuVi = ["Th??i D????ng", "Th??i ??m", "Li??m Trinh", "C??? M??n", "Thi??n C??", "V??n Kh??c", "Thi??n ?????ng", "V??n X????ng", "V?? Kh??c", "Tham Lang"];
    const tenTuVi= arrayTuVi[ThienCan.indexOf(tenCan)];
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnTuVi" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a K???<br>";
            break;
        }
        let idAnSaoKhac = "SaoKhac" + (i+1);
        let datak = document.getElementById(idAnSaoKhac).innerHTML;
        if(datak.indexOf(tenTuVi) !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H??a K???<br>";
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
    const arrayChi = ["Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Long Tr??<br>";
}

function saoPhuongCac(tenChi)
{
    const arrayChi = ["Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Ph?????ng C??c<br>";
}

function saoGiaiThan(tenChi)
{
    const arrayChi = ["Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Gi???i Th???n<br>";
}

function saoThienKhoc(tenChi)
{
    const arrayChi = ["Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i", "Tu???t", "D???u", "Th??n", "M??i"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Kh???c<br>";
}

function saoThienHu(tenChi)
{
    const arrayChi = ["Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n H??<br>";
}

function saoThienDuc(tenChi)
{
    const arrayChi = ["D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n ?????c<br>";
}

function saoNguyetDuc(tenChi)
{
    const arrayChi = ["T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Nguy???t ?????c<br>";
}

function saoHongLoan(tenChi)
{
    const arrayChi = ["M??o", "D???n", "S???u", "T??", "H???i", "Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " H???ng Loan<br>";
}

function saoThienHy(tenChi)
{
    const arrayChi = ["D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i", "Tu???t"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n H???<br>";
}

function saoCoThan(tenChi)
{
    const arrayChi = ["D???n", "D???n", "T???", "T???", "T???", "Th??n", "Th??n", "Th??n", "H???i", "H???i", "H???i", "D???n"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " C?? Th???n<br>";
}

function saoQuaTu(tenChi)
{
    const arrayChi = ["Tu???t", "Tu???t", "S???u", "S???u", "S???u", "Th??n", "Th??n", "Th??n", "M??i", "M??i", "M??i", "Tu???t"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Qu??? T??<br>";
}

function saoDaoHoa(tenChi)
{
    const arrayChi = ["D???u", "Ng???", "M??o", "T??", "D???u", "Ng???", "M??o", "T??", "D???u", "Ng???", "M??o", "T??"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " ????o Hoa<br>";
}

function saoThienMa(tenChi)
{
    const arrayChi = ["D???n", "H???i", "Th??n", "T???", "D???n", "H???i", "Th??n", "T???", "D???n", "H???i", "Th??n", "T???"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n M??<br>";
}

function saoKiepSat(tenChi)
{
    const arrayChi = ["T???", "D???n", "H???i", "Th??n", "T???", "D???n", "H???i", "Th??n", "T???", "D???n", "H???i", "Th??n"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Ki???p S??t<br>";
}

function saoHoaCai(tenChi)
{
    const arrayChi = ["Th??n", "S???u", "Tu???t", "M??i", "Th??n", "S???u", "Tu???t", "M??i", "Th??n", "S???u", "Tu???t", "M??i"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Hoa C??i<br>";
}

function saoPhaToai(tenChi)
{
    const arrayChi = ["T???", "S???u", "D???u", "T???", "S???u", "D???u", "T???", "S???u", "D???u", "T???", "S???u", "D???u"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Ph?? To??i<br>";
}

function saoThienKhong(tenChi)
{
    const arrayChi = ["S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??"];
    const tempChi= arrayChi[DiaChi.indexOf(tenChi)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Kh??ng<br>";
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
    const arrayChi = ["Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " T??? Ph??<br>";

}

function saoHuuBat(tenThang)
{
    const arrayChi = ["Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " H???u B???t<br>";

}

function saoThienHinh(tenThang)
{
    const arrayChi = ["D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n H??nh<br>";

}

function saoThienRieu(tenThang)
{
    const arrayChi = ["S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Ri??u<br>";

}

function saoThienY(tenThang)
{
    const arrayChi = ["S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??"];
    const tempChi= arrayChi[tenThang - 1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Y<br>";

}

function saoThienGiai(tenThang)
{
    const arrayChi = ["Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i"];
    const tempChi= arrayChi[tenThang -1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Gi???i<br>";

}

function saoDiaGiai(tenThang)
{
    const arrayChi = ["M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???"];
    const tempChi= arrayChi[tenThang -1];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " ?????a Gi???i<br>";

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
    const arrayChi = ["Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??", "H???i"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " V??n X????ng<br>";
}

function saoVanKhuc(tenGio)
{
    const arrayChi = ["Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " V??n Kh??c<br>";
}

function saoThaiPhu(tenGio)
{
    const arrayChi = ["Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thai Ph???<br>";
}

function saoPhongCao(tenGio)
{
    const arrayChi = ["D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t", "H???i", "T??", "S???u"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Phong C??o<br>";
}

function saoDiaKhong(tenGio)
{
    const arrayChi = ["H???i", "Tu???t", "D???u", "Th??n", "M??i", "Ng???", "T???", "Th??n", "M??o", "D???n", "S???u", "T??"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " ?????a Kh??ng<br>";
}

function saoDiaKiep(tenGio)
{
    const arrayChi = ["H???i", "T??", "S???u", "D???n", "M??o", "Th??n", "T???", "Ng???", "M??i", "Th??n", "D???u", "Tu???t"];
    const tempChi= arrayChi[DiaChi.indexOf(tenGio)];
    const index = ChieuThuan.indexOf(tempChi);

    let idThienKhoi = "SaoKhac" + (index + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " ?????a Ki???p<br>";
}

function saoHoaLinh(tenChi, tenGio, NamOrNu)
{
    let hoa, linh;
    switch(tenChi)
    {
        case "D???n":
        case "Ng???":
        case "Tu???t":
            hoa = ChieuThuan.indexOf("S???u");
            linh = ChieuThuan.indexOf("M??o");
        break;
        case "Th??n":
        case "T??":
        case "Th??n":
            hoa = ChieuThuan.indexOf("D???n");
            linh = ChieuThuan.indexOf("Tu???t");
        break; 
        case "T???":
        case "D???u":
        case "S???u":
            hoa = ChieuThuan.indexOf("M??o");
            linh = ChieuThuan.indexOf("Tu???t");
        break;
        case "H???i":
        case "M??o":
        case "M??i":
            hoa = ChieuThuan.indexOf("D???u");
            linh = ChieuThuan.indexOf("Tu???t");
        break;
    }

    if(NamOrNu == "Nam")
    {
        if(ViTriMenh%2 === 1) //??m Nam
        {
            console.log("??m Nam" + hoa);
            hoa = hoa - DiaChi.indexOf(tenGio);
            if(hoa < 0) hoa = hoa +12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H???a Tinh<br>";
            
            linh = linh + DiaChi.indexOf(tenGio);
            if(linh > 11) linh = linh -12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
        else //D????ng Nam
        {
            console.log("D????ng Nam");
            hoa = hoa + DiaChi.indexOf(tenGio);
            if(hoa > 11) hoa = hoa -12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H???a Tinh<br>";
            
            linh = linh - DiaChi.indexOf(tenGio);
            if(linh < 0) linh = linh +12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
    }
    else if(NamOrNu == "N???")
    {
        if(ViTriMenh%2 === 1) //??m N???
        {
            console.log("??m N???");
            hoa = hoa + DiaChi.indexOf(tenGio);
            if(hoa > 11) hoa = hoa -12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H???a Tinh<br>";
            
            linh = linh - DiaChi.indexOf(tenGio);
            if(linh < 0) linh = linh +12;
            idThienKhoi = "SaoKhac" + (linh + 1);
            temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Linh Tinh<br>";
        }
        else //D????ng n???
        {
            console.log("D????ng N???");
            hoa = hoa - DiaChi.indexOf(tenGio);
            if(hoa < 0) hoa = hoa +12;
            let idThienKhoi = "SaoKhac" + (hoa + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " H???a Tinh<br>";
            
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
        case 0: retTuan = "Tu???t - H???i";
        break;
        case 10: retTuan = "Th??n - D???u";
        break;
        case 8: retTuan = "Ng??? - M??i";
        break;
        case 6: retTuan = "Th??n - T???";
        break;
        case 4: retTuan = "D???n - M??o";
        break;
        case 2: retTuan = "T?? - S???u";
        break;
    }
    let retTriet;
    switch(indexCan)
    {
        case 5:
        case 0: retTriet = "Th??n - D???u";
        break;
        case 6:
        case 1: retTriet = "Ng??? - M??i";
        break;
        case 7:
        case 2: retTriet = "Th??n - T???";
        break;
        case 8:
        case 3: retTriet = "D???n - M??o";
        break;
        case 9:
        case 4: retTriet = "T?? - S???u";
        break;
    }
    
    document.getElementById("TuanTriet").innerHTML = "Tu???n t???i: " + retTuan + "<br><br>Tri???t t???i: " + retTriet;
}

function saoDauQuan(tenThang, tenGio)
{
    let thaiTue;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "AnThaiTue" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("Th??i Tu???") !== -1)
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
    document.getElementById(idThienKhoi).innerHTML = temp + " ?????u Qu??n<br>";
        
}

function saoThienTai(tenChi)
{
    let a = ViTriMenh + DiaChi.indexOf(tenChi);
    if(a > 11) a = a -12;
    let idThienKhoi = "SaoKhac" + (a + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n T??i<br>";
        
}

function saoThienTho(tenChi)
{
    let a = viTriThan + DiaChi.indexOf(tenChi);
    if(a > 11) a = a -12;
    let idThienKhoi = "SaoKhac" + (a + 1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Th???<br>";
        
}

function saoAnQuang(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("V??n X????ng") !== -1)
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
    document.getElementById(idThienKhoi).innerHTML = temp + " ??n Quang<br>";
}

function saoThienQuy(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("V??n Kh??c") !== -1)
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
    document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Qu??<br>";
}

function saoTamTai(tenNgay)
{
    let index;
    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "SaoKhac" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("T??? Ph??") !== -1)
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
        if(data.indexOf("H???u B???t") !== -1)
        {
            index = i;
            break;
        }
    }

    let a = index - tenNgay%12 + 1;
    if(a < 0) a = a + 12;
    let idThienKhoi = "SaoKhac" + (a+1);
    let temp = document.getElementById(idThienKhoi).innerHTML;
    document.getElementById(idThienKhoi).innerHTML = temp + " B??t T???a<br>";
}

function anSaoCoDinh()
{
    let temp = document.getElementById("SaoKhac3").innerHTML;
    document.getElementById("SaoKhac3").innerHTML = temp + " Thi??n La<br>";

    temp = document.getElementById("SaoKhac9").innerHTML;
    document.getElementById("SaoKhac9").innerHTML = temp + " ?????a V??ng<br>";

    for(let i = 0; i <12; i++)
    {
        let idAnTuVi = "CungMenh" + (i+1);
        let data = document.getElementById(idAnTuVi).innerHTML;
        if(data.indexOf("N?? B???C") !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n Th????ng<br>";
        }
        if(data.indexOf("T???T ??CH") !== -1)
        {
            let idThienKhoi = "SaoKhac" + (i + 1);
            let temp = document.getElementById(idThienKhoi).innerHTML;
            document.getElementById(idThienKhoi).innerHTML = temp + " Thi??n S???<br>";
        }
    }

}