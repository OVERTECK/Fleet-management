using Backend.API.EndpointsSettings;
using Backend.API.Features.Cars;
using Backend.API.Features.Drivers;
using Backend.API.Features.GasStation;
using Backend.API.Services;
using Backend.DataAccess;
using Backend.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Exceptions;

namespace Backend.API.Configuration;

public static class DI
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddSerilogLogging(configuration)
            .AddOpenApiSpec()
            .AddCors()
            .AddMyHandlers()
            .AddServices()
            .AddRepositories()
            .AddMyDbContext(configuration)
            .AddEndpoints(typeof(DI).Assembly);
    }

    private static IServiceCollection AddOpenApiSpec(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddEndpoints(typeof(Program).Assembly);

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("Application", "Backend.API"));

        return services;
    }

    private static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString(nameof(MyDbContext)));
        });

        return services;
    }

    private static IServiceCollection AddMyHandlers(this IServiceCollection services)
    {
        services.AddScoped<CarsGetAllHadler>();
        services.AddScoped<CarGetByIdHandler>();
        services.AddScoped<CarCreateHandler>();
        services.AddScoped<CarUpdateHandler>();
        services.AddScoped<CarDeleteHandler>();

        services.AddScoped<DriverCreateHandler>();
        services.AddScoped<DriverGetAllHandler>();
        services.AddScoped<DriverGetByIdHandler>();
        services.AddScoped<DriverUpdateHandler>();
        services.AddScoped<DriverDeleteHandler>();

        services.AddScoped<GasStationCreateHandler>();
        services.AddScoped<GasStationDeleteHandler>();
        services.AddScoped<GasStationUpdateHandler>();
        services.AddScoped<GasStationGetAllHandler>();
        services.AddScoped<GasStationGetByIdHandler>();

        return services;
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<CarsService>();
        services.AddScoped<DriversService>();
        services.AddScoped<GasStationsService>();

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<CarsRepository>();
        services.AddScoped<DriversRepository>();
        services.AddScoped<GasStationsRepository>();
        services.AddScoped<MaintenanceRecordsRepository>();
        services.AddScoped<RouteRepository>();
        services.AddScoped<TargetsRepository>();
        services.AddScoped<TripsRepository>();
        
        return services;
    }

    private static IServiceCollection AddCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }
}