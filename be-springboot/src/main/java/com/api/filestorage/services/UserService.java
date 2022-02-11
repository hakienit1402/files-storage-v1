package com.api.filestorage.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.api.filestorage.dto.RoleDTO;
import com.api.filestorage.dto.UserDTO;
import com.api.filestorage.entities.AccountPackageEntity;
import com.api.filestorage.entities.FilesEntity;
import com.api.filestorage.entities.MusicFileEntity;
import com.api.filestorage.entities.OtpEntity;
import com.api.filestorage.entities.PictureFileEntity;
import com.api.filestorage.entities.UserEntity;
import com.api.filestorage.entities.VideoFileEntity;
import com.api.filestorage.entities.file_shared.BaseFileShared;
import com.api.filestorage.repository.AccountPackageRepository;
import com.api.filestorage.repository.MusicRepository;
import com.api.filestorage.repository.OtpRepository;
import com.api.filestorage.repository.PictureRepository;
import com.api.filestorage.repository.UserRepository;
import com.api.filestorage.repository.VideoRepository;
import com.api.filestorage.repository.file_shared.MusicSharedRepository;
import com.api.filestorage.repository.file_shared.PictureSharedRepository;
import com.api.filestorage.repository.file_shared.VideoSharedRepository;
import com.api.filestorage.security.UserDetailsImpl;
import com.api.filestorage.security.jwt.JwtUtils;
import com.api.filestorage.security.payload.request.LoginRequest;
import com.api.filestorage.security.payload.response.JwtResponse;
import com.api.filestorage.services.ClazzData.DataShared;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OtpRepository otpRepository;
    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserEntity> findAll() {
        // return userRepository.findAll().stream().map(u -> {
        // return new UserDTO().toDTO(u);
        // }).collect(Collectors.toList());
        return userRepository.findAll();
    }

    public boolean checkPassword(Map<String, String> pwd) {
        UserEntity userEntity = userRepository.findByUsername(pwd.get("username"));
        String password = pwd.get("password");
        return passwordEncoder.matches(password, userEntity.getPassword());
    }

    public UserDTO findByUsername(String userName) {
        UserEntity userEntity = userRepository.findByUsername(userName);
        if (userEntity == null)
            return null;
        return new UserDTO().toDTO(userEntity);
    }

    public UserDTO findByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null)
            return null;
        return new UserDTO().toDTO(userEntity);
    }

    public JwtResponse signIn(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toSet());

        return new JwtResponse(jwt, userDetails.getUsername(), userDetails.getEmail(), userDetails.getFull_name(),
                userDetails.getAcc_pkg_name(), userDetails.getAcc_pkg_size(), roles);
    }

    public void signUp(UserDTO user) {
        RoleDTO role = new RoleDTO(1, "ROLE_USER");
        user.getRoles().add(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIs_active(1);
        UserEntity entity = new UserEntity().toEntity(user);

        entity.setAcc_pkg(new AccountPackageEntity(1, "Normal", 16106127360L, 0));
        userRepository.save(entity);
    }

    public boolean validateOtpSignup(String uuid, String code) {
        try {
            return otpRepository.validOtp(uuid, Integer.parseInt(code)) != null;
        } catch (NumberFormatException e) {
            return false;
        }

    }

    public void sendEmail(String email, String uuid) {
        int randomCode = mailService.sendEmail(email);
        if (randomCode != 0) {
            OtpEntity entity = new OtpEntity();
            entity.setCode(randomCode);
            entity.setUuid(uuid);
            entity.setEmail(email);
            entity.setExpireTime(LocalDateTime.now().plusMinutes(3));
            otpRepository.save(entity);
        }
    }

    public boolean otpIsValid(Map<String, String> data) {
        return otpRepository.validOtpEmail(data.get("email"), Integer.parseInt(data.get("otp"))) != null;
    }

    public boolean updatePwd(Map<String, String> data) {
        UserEntity userEntity = userRepository.findByEmail(data.get("email"));
        userEntity.setPassword(passwordEncoder.encode(data.get("pwd")));
        try {
            userRepository.save(userEntity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public long getUsedMemory(String userName) {
        // Get tat ca cac size trong music, video, picture
        Long size_music = musicRepository.getTotalSize(userName, BaseService.FOLDER_EXT);
        size_music = size_music != null ? size_music : 0;
        Long size_picture = pictureRepository.getTotalSize(userName, BaseService.FOLDER_EXT);
        size_picture = size_picture != null ? size_picture : 0;
        Long size_video = videoRepository.getTotalSize(userName, BaseService.FOLDER_EXT);
        size_video = size_video != null ? size_video : 0;
        return size_music + size_picture + size_video;
    }

    public long getTotalMemory(int price) {
        return AccountPackageEntity.findByPrice(price).getTotal_size();
    }

    public List<FilesEntity> getTrash(String username) {
        List<? extends FilesEntity> listVideos = getOnlyFolderParent(videoRepository.findByStateAndCreator(0, username),
                "videos");
        List<? extends FilesEntity> listMusics = getOnlyFolderParent(musicRepository.findByStateAndCreator(0, username),
                "musics");
        List<? extends FilesEntity> listPicture = getOnlyFolderParent(
                pictureRepository.findByStateAndCreator(0, username), "pictures");
        List<FilesEntity> rs = new ArrayList<>();
        rs.addAll(listVideos);
        rs.addAll(listMusics);
        rs.addAll(listPicture);
        return rs;
    }

    public List<DataShared> getShared(String username) {
        List<? extends BaseFileShared> videos = videoSharedRepository.findByReceiver(username);
        List<? extends BaseFileShared> pictures = pictureSharedRepository.findByReceiver(username);
        List<? extends BaseFileShared> musics = musicSharedRepository.findByReceiver(username);
        List<DataShared> rs = new ArrayList<>();
        rs.addAll(videos.stream().map(f -> {
            VideoFileEntity entity = videoRepository.findById(f.getFile_id());
            return new DataShared(f.getFile_id(), entity.getFile_sk(), entity.getName(), entity.getSize(),
                    entity.getExtension(), entity.getParent(), f.getOwner(), "videos");
        }).collect(Collectors.toList()));

        rs.addAll(pictures.stream().map(f -> {
            PictureFileEntity entity = pictureRepository.findById(f.getFile_id());
            return new DataShared(f.getFile_id(), entity.getFile_sk(), entity.getName(), entity.getSize(),
                    entity.getExtension(), entity.getParent(), f.getOwner(), "pictures");
        }).collect(Collectors.toList()));

        rs.addAll(musics.stream().map(f -> {
            MusicFileEntity entity = musicRepository.findById(f.getFile_id());
            return new DataShared(f.getFile_id(), entity.getFile_sk(), entity.getName(), entity.getSize(),
                    entity.getExtension(), entity.getParent(), f.getOwner(), "musics");
        }).collect(Collectors.toList()));

        return rs;
    }

    private List<? extends FilesEntity> getOnlyFolderParent(List<? extends FilesEntity> list, String kind) {
        // kind: định nghĩa file đó thuộc nhóm nào (music, video, picture)
        // Vì thuộc tính parent trong trường hợp này k dùng nên lấy set tạm
        if (list.isEmpty())
            return new ArrayList<>();
        List<String> fileNames = list.stream().map(file -> file.getName()).collect(Collectors.toList());
        return list.stream().filter(file -> !fileNames.contains(file.getParent())).map(map -> {
            map.setParent(kind);
            return map;
        }).collect(Collectors.toList());
    }

    public String findByUserNameOrEmail(String text) {
        UserEntity userEntity;
        if (text.contains("@")) {
            userEntity = userRepository.findByEmail(text);
            if (userEntity != null)
                return userEntity.getEmail();
            return "";
        } else {
            userEntity = userRepository.findByUsername(text);
            if (userEntity != null)
                return userEntity.getUsername();
            return "";
        }
    }

    public List<FilesEntity> getListSearch(String creator, String query) {
        List<FilesEntity> rs = new ArrayList<>();
        String transQue = "%" + query + "%";
        List<MusicFileEntity> musics = musicRepository.findSearch(creator, transQue);
        List<VideoFileEntity> videos = videoRepository.findSearch(creator, transQue);
        List<PictureFileEntity> pictures = pictureRepository.findSearch(creator, transQue);
        rs.addAll(musics);
        rs.addAll(videos);
        rs.addAll(pictures);
        return rs;
    }

    @Autowired
    private MusicRepository musicRepository;
    @Autowired
    private PictureRepository pictureRepository;
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoSharedRepository videoSharedRepository;
    @Autowired
    private MusicSharedRepository musicSharedRepository;
    @Autowired
    private PictureSharedRepository pictureSharedRepository;

    @Autowired
    private AccountPackageRepository AccountPackageEntity;

}
