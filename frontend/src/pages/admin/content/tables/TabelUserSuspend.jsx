import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../KelolaUserContent.module.css";

const ITEMS_PER_PAGE = 5;

const TabelUserSuspend = ({ users, properties, actions }) => {
  const [currentPage,setCurrentPage]=useState(1);
  const paginate=list=>{
    const start=(currentPage-1)*ITEMS_PER_PAGE;
    return list.slice(start,start+ITEMS_PER_PAGE);
  }
  const totalPages=Math.ceil(users.length/ITEMS_PER_PAGE);

  return (
    <div className={styles.tableWrapper}>
      <h3>User Suspend</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th><th>Username</th><th>Nama</th><th>Email</th><th>HP</th><th>Properti</th><th>Status</th><th>Tgl Bergabung</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {paginate(users).map((user,idx)=>{
              const userProps=properties.filter(p=>p.ownerId===user.id);
              return (
                <motion.tr key={user.id} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                  <td>{idx+1 + (currentPage-1)*ITEMS_PER_PAGE}</td>
                  <td>{user.username}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.no_hp}</td>
                  <td>{userProps.length}</td>
                  <td className={styles.statusCell}><span className={styles.pending}>⏱ Suspend</span></td>
                  <td>{user.joinedAt}</td>
                  <td className={styles.actions}>{actions(user)}</td>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {totalPages>1 && (
        <div className={styles.pagination}>
          <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className={styles.pageBtn}>‹</button>
          {Array.from({length:totalPages},(_,i)=>(
            <button key={i+1} disabled={currentPage===i+1} onClick={()=>setCurrentPage(i+1)} className={`${styles.pageBtn} ${currentPage===i+1?styles.activePage:""}`}>{i+1}</button>
          ))}
          <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} className={styles.pageBtn}>›</button>
        </div>
      )}
    </div>
  )
}

export default TabelUserSuspend;
