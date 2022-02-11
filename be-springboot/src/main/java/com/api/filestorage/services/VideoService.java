package com.api.filestorage.services;

import java.util.List;
import java.util.Map;

import com.api.filestorage.dto.FileMoveDTO;
import com.api.filestorage.dto.FileMoveDTO.Data;
import com.api.filestorage.entities.FilesEntity;
import com.api.filestorage.entities.VideoFileEntity;
import com.api.filestorage.repository.VideoRepository;
import com.api.filestorage.services.ClazzData.DataShared;
import com.api.filestorage.services.ClazzData.TrashOrUnTrash;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VideoService implements BaseService<VideoFileEntity> {
    @Autowired
    private VideoRepository videoRepository;

    @Override
    public List<? extends FilesEntity> findAllFileInParent(int state, String creator, String parent) {
        return BaseService.super.findAllFileInParent(state, creator, parent, videoRepository);
    }

    @Override
    public boolean editFilesName(Map<String, String> filesModel) {
        return BaseService.super.editFilesName(filesModel, videoRepository);
    }

    @Override
    public boolean createFolder(FilesEntity files) {
        return BaseService.super.createFolder(files, videoRepository);
    }

    @Override
    public void editFilesState(TrashOrUnTrash trash) {
        BaseService.super.editFilesState(trash, videoRepository);
    }

    @Override
    public boolean moveFile(FileMoveDTO filesModel) {
        return BaseService.super.moveFile(filesModel, videoRepository);
    }

    @Override
    public boolean uploadFile(MultipartFile file, String fileInfor) {
        return BaseService.super.uploadFile(file, fileInfor, videoRepository);
    }

    // 20210519
    @Override
    public List<? extends FilesEntity> findAllFolderInParent(String creator, String parent) {
        return BaseService.super.findAllFolderInParent(creator, parent, videoRepository);
    }

    @Override
    public List<Data> copyFile(FileMoveDTO filesModel) {
        return BaseService.super.copyFile(filesModel, videoRepository);
    }

    @Override
    public List<DataShared> findAllFileInParent(String creator, String parent) {
        return BaseService.super.findAllFileInParent(creator, parent, "videos", videoRepository);
    }

    @Override
    public void delete(TrashOrUnTrash trash) {
        BaseService.super.delete(trash, videoRepository);
    }
}
