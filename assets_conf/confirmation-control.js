(function(){
  const HEADERS=[
    "NO","JENIS KONFIRMASI","NAMA KLIEN","PIHAK DIKONFIRMASI","ALAMAT",
    "NOMOR SURAT","TANGGAL SURAT","TANGGAL CUT-OFF","PENANDATANGAN 1",
    "JABATAN 1","PENANDATANGAN 2","JABATAN 2","STATUS","TANGGAL DIKIRIM",
    "TANGGAL DITERIMA","PIC","METODE PENGIRIMAN","REFERENSI BALASAN",
    "SELISIH / EXCEPTION","TINDAK LANJUT","CATATAN"
  ];
  const WIDTHS=[6,22,30,34,42,28,18,18,24,22,24,22,20,18,18,22,22,24,28,28,32];
  function text(value){return value==null?"":String(value).trim()}
  function safeName(value){return text(value||"Klien").replace(/[\\/:*?"<>|]/g,"-").slice(0,70)}
  function downloadConfirmationControl(config){
    if(!window.XLSX){alert("Engine Excel belum termuat. Periksa koneksi internet lalu coba kembali.");return}
    const source=Array.isArray(config.rows)?config.rows:[];
    if(!source.length){alert("Tambahkan minimal satu data konfirmasi terlebih dahulu.");return}
    const rows=source.map((r,i)=>[
      i+1,text(config.type),text(config.client),text(r.name),text(r.address),text(r.number),
      text(r.letterDate),text(config.cutoff),text(r.signName),text(r.signTitle),text(r.signName2),
      text(r.signTitle2),"Belum Dikirim","","","","","","","",""
    ]);
    const title=`CONFIRMATION CONTROL - ${text(config.type).toUpperCase()}`;
    const data=[[title],[],["Nama Klien",text(config.client)],["Tanggal Cut-off",text(config.cutoff)],[],HEADERS,...rows];
    const ws=XLSX.utils.aoa_to_sheet(data);
    ws["!merges"]=[XLSX.utils.decode_range("A1:U1")];
    ws["!cols"]=WIDTHS.map(w=>({wch:w}));
    ws["!rows"]=[{hpt:26},{hpt:8},{hpt:20},{hpt:20},{hpt:8},{hpt:34}];
    ws["!autofilter"]={ref:`A6:U${6+rows.length}`};
    ws["!freeze"]={xSplit:0,ySplit:6,topLeftCell:"A7",activePane:"bottomLeft",state:"frozen"};
    const guide=XLSX.utils.aoa_to_sheet([
      ["PETUNJUK CONFIRMATION CONTROL"],[],
      ["Kolom","Penggunaan"],
      ["STATUS","Isi: Belum Dikirim, Sudah Dikirim, Diterima, Perlu Tindak Lanjut, atau Selesai."],
      ["TANGGAL DIKIRIM / DITERIMA","Catat tanggal aktual untuk memantau umur konfirmasi."],
      ["REFERENSI BALASAN","Nomor surat, email, resi, atau referensi jawaban pihak ketiga."],
      ["SELISIH / EXCEPTION","Catat perbedaan antara jawaban konfirmasi dan catatan klien."],
      ["TINDAK LANJUT","Tuliskan prosedur lanjutan, PIC, dan target penyelesaian."],
      ["CATATAN","Informasi tambahan yang relevan untuk dokumentasi audit."]
    ]);
    guide["!merges"]=[XLSX.utils.decode_range("A1:B1")];
    guide["!cols"]=[{wch:28},{wch:95}];
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Confirmation Control");
    XLSX.utils.book_append_sheet(wb,guide,"Petunjuk");
    wb.Props={Title:title,Subject:"Audit confirmation tracking",Author:"Audit Toolkit",CreatedDate:new Date()};
    XLSX.writeFile(wb,`Confirmation Control - ${safeName(config.type)} - ${safeName(config.client)}.xlsx`,{compression:true});
  }
  window.downloadConfirmationControl=downloadConfirmationControl;
})();
